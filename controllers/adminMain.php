<?php
require_once("classes/TestsDB2.php");

$filename = $_REQUEST['file'];
//file_put_contents('./test2.json', $_REQUEST);

//получить данные теста
$testsDB = new TestsDB();
$testsDB::$file =   /*'../math_test/test-data/math1.json'*/ '../math_test/tests/' . $filename;

$testData = $testsDB->getTestsData();
$testData = json_decode($testData, true);

$testData['tasks'] = array_values($testData['tasks']);

//helper: первая заглавная буква для utf-8 строки
function mb_ucfirst($text) {
    return mb_strtoupper(mb_substr($text, 0, 1)) . mb_substr($text, 1);
}

//set view_number & max_points
foreach($testData['tasks'] as $key => $task) {
    $testData['tasks'][$key]['view_number'] = $key + 1;

    $testData['tasks'][$key]['type'] = mb_ucfirst($task['type']);

    $taskPoints = 0;
    foreach($task['answer_points'] as $answerPoints) {
        $taskPoints += $answerPoints;
    }
    $testData['tasks'][$key]['max_points'] = $taskPoints;

    //timer data timestamp to array
    if(isset($task['taskTimerData'])) {
        $testData['tasks'][$key]['taskTimerData'] = $testsDB->timestampToArray($task['taskTimerData']);
    }


}

//подключить шаблон центральный шаблон админки
require_once 'views/adminMain.php';
?>