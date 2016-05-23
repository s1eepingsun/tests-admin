<?php
require_once("classes/TestsDB2.php");
$testsDB = new TestsDB();

$filename = $_REQUEST['file'];
//file_put_contents('./test.json', $_REQUEST['file']);

$regexp = '#^(.*)/#U';
preg_match($regexp, $filename, $matches);
$testType = $matches[1];


//$testsDB::$file = '../math_test/tests/' . $filename;
$testsDB::$file = 'c://v6-vagrant/v6-env/repos/v6-apps/tests/frontend/tests/' . $filename;
//$testsDB::$file = '../../../../v6-vagrant/v6-env/repos/v6-apps/tests/frontend/tests/' . $filename;
$data = $testsDB->getTestsData();

//$commonDataPath = '../math_test/tests/' . $testType . '/test-data/common.json';
//$commonDataPath = '../math_test/tests/' . $filename;
$commonDataPath = 'c://v6-vagrant/v6-env/repos/v6-apps/tests/frontend/tests/' . $filename;

$testsDB::$file = $commonDataPath;
$commonData = $testsDB->getTestsData();
$commonData = json_encode($commonData);


//file_put_contents('./test3.json', $commonData);
?>

<script type="text/javascript">
    var phpTestData = <?=$data?>;
    var commonData = JSON.parse(<?=$commonData?>);

    phpTestData['description'] = commonData['description'];
    phpTestData['in_task_description'] = commonData['in_task_description'];
    phpTestData['start_message'] = commonData['start_message'];
    phpTestData['testTimerData'] = commonData['testTimerData'];

//    console.log('commonData:', commonData);
    console.log('phpTestData x: ', phpTestData);
</script> 