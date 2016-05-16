<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$filename = $_REQUEST['file'];

//получить данные теста
require_once("classes/TestsDB2.php");

$testsDB = new TestsDB();
$testsDB::$file =   /*'../math_test/test-data/math1.json'*/ '../math_test/tests/' . $filename;

$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

$testData['tasks'] = array_values($testData['tasks']);

//set view_number & max_points
foreach($testData['tasks'] as $key => $task) {
    $testData['tasks'][$key]['view_number'] = $key + 1 ;

    $taskPoints = 0;
    foreach($task['answer_points'] as $answerPoints) {
        $taskPoints += $answerPoints;
    }
    $testData['tasks'][$key]['max_points'] = $taskPoints ;

}


//подключить шаблон сайдбара
require_once 'views/adminTaskList.php';
?>