<?php

require_once("../classes/TestsDB2.php");


//start logs block
$req = array();
foreach($_SERVER as $key => $value) {
    $req[$key] = $value;
}

/*$server = array();
foreach($_SERVER as $key => $value) {
    $server[$key] = $value;
}
$server = json_encode($server);*/

//        $data = $_SERVER['REQUEST_URI'];
//        $data = $_SERVER['HTTP_REFERER'];

    //    $data = $_SERVER['REQUEST_METHOD'];
//    $data = json_decode($_REQUEST['model'], true);

    /*$data['file'] = 'asdf';
    $data['file2'] = 'asdf2';
    unset($data['file']);*/
//    file_put_contents('./test.json', substr($_REQUEST['file'], 4, 11));
    file_put_contents('./test2.json', $_REQUEST);
//    file_put_contents('./test2.json', $server);

/*
$server = json_encode($server);
$file = json_decode($_REQUEST['model'], true);
$file = $file['file'];*/
//file_put_contents('./test.json', $file);

//end logs block

if(isset($_REQUEST['_method'])) {
    $method = $_REQUEST['_method'];
} else {
    $method = $_SERVER['REQUEST_METHOD'];
}


if(isset($_REQUEST['model'])) $model = json_decode($_REQUEST['model'], true);

/*if(isset($model['file'])) {
    $file = '../../math_test/test-data/' . $model['file'];
} elseif($_REQUEST != '' && isset($_REQUEST['file'])) {
    $file = '../../math_test/test-data/' . $_REQUEST['file'] . '.json';
} else {
    $file = '../../math_test/test-data/math1.json';
}*/


if(isset($_REQUEST['file']) && substr($_REQUEST['file'], 4, 11) === '/test-data/') {
//    $file = '../../math_test/tests/' . $_REQUEST['file'] . '.json';
//    $file = '../../math_test/' . $_REQUEST['file'] . '.json';
    $file = 'c://v6-vagrant/v6-env/repos/v6-apps/tests/frontend/tests/' . $_REQUEST['file'] . '.json';
    file_put_contents('./test.json', 'if ' . $file);
} else if(isset($model['file'])) {
    $model2 = json_decode($_REQUEST['model'], true);
    $file = $model2['file'];

//    $file = '../../math_test/tests/' . $file;
//    $file = '../../math_test/' . $file;
    $file = 'c://v6-vagrant/v6-env/repos/v6-apps/tests/frontend/tests/' . $file;
    file_put_contents('./test.json', 'else if ' . $file);
} else {
//    $file = /*'../../math_test/tests/' .*/ $file . '.json';
    $file = json_decode($_REQUEST['model'], true);
    $file = $file['file'];

    file_put_contents('./test.json', 'else ' /*. $_REQUEST*/);
}

//file_put_contents('./test.json', $file);

//$file = '../../math_test/test-data/math1.json';

//file_put_contents('./test.json', $file);

$shortFile = '../../math_test/test-data/math1-short.json';
if(!file_exists($file)) exit("file doesn't exists");

$testsDB = new TestsDB();
$testsDB::$file = $file;
$testsDB::$shortFile = $shortFile;

$uri = $_SERVER['REQUEST_URI'];

switch($method) {
    case 'GET':
        $data = $testsDB->getTestsData();
//        $data = json_encode($data);
//        file_put_contents('./test.json', $data);
        echo $data;
        break;

    case 'POST':
        if (isset($model['answers']) || isset($model['task_content'])) {
            $testsDB->setTask($model);
            $testsDB->resetOrderValues();
            $testsDB->createShortVersion();
            break;
        } else {
            $testsDB->setTestInfo($model);
            break;
        }

    case 'PUT':
        if (isset($model['answers']) || isset($model['task_content'])) {
            $testsDB->setTask($model);
            $testsDB->resetOrderValues();
            $testsDB->createShortVersion();
            break;
        } else {
            $testsDB->setTestInfo($model);
            break;
        }

    case 'DELETE':
        //берёт id задачи - последняя часть запроса URI, нужно брать из uri т.к. тело запроса отсутствует
        $pattern = '/.*\/(\d+)$/';
        preg_match($pattern, $uri, $matches);
        $id = $matches[1];
        $testsDB->deleteTask($id);
        $testsDB->resetOrderValues();
        $testsDB->createShortVersion();
        break;
}

