<?php

require_once("../classes/TestsDB2.php");



//start logs block
//        $data = $_SERVER['REQUEST_URI'];
        $data = $_SERVER['QUERY_STRING'];

    //    $data = $_SERVER['REQUEST_METHOD'];
//    $data = json_decode($_REQUEST['model'], true);

    /*$data['file'] = 'asdf';
    $data['file2'] = 'asdf2';
    unset($data['file']);*/
//    file_put_contents('./test.json', $_REQUEST);
//end logs block

if(isset($_REQUEST['_method'])) {
    $method = $_REQUEST['_method'];
} else {
    $method = $_SERVER['REQUEST_METHOD'];
}

print_r($_REQUEST);

if(isset($_REQUEST['model'])) $model = json_decode($_REQUEST['model'], true);
//$file = '../../newtest2/test-data/' . $model['file'];
if(isset($model['file'])) {
    $file = '../../newtest2/test-data/' . $model['file'];
} elseif($_REQUEST != '') {
//    $fileName = json_decode($_REQUEST, true);
    $file = '../../newtest2/test-data/' . $_REQUEST['file'] . '.json';
} else {
    $file = '../../newtest2/test-data/math1.json';
}

$file = '../../newtest2/test-data/math1.json';

file_put_contents('./test.json', $file);

$shortFile = '../../newtest2/test-data/math1-short.json';
if(!file_exists($file)) exit("file doesn't exists");

$testsDB = new TestsDB();
$testsDB::$file = $file;
$testsDB::$shortFile = $shortFile;

$uri = $_SERVER['REQUEST_URI'];

switch($method) {
    case 'GET':
        $data = $testsDB->getTestsData();
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

