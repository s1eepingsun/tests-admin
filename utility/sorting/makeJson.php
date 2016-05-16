<?php
$data = $_REQUEST;
//$ticketNum = $data['ticket_num'];
//unset($data['ticket_num']);

$data1 = $data;
$data2 = $data;
$data3 = $data;

$datas = [$data1, $data2, $data3];

$i = 1;
foreach($datas as $dataKey => $singleData) {
    $datas[$dataKey]['tasks'] = [];

    for($j = 1; $j <= 25; $j++) {
        $datas[$dataKey]['tasks'][$j] = $data['tasks'][$i];
        $datas[$dataKey]['tasks'][$j]['id'] = $j;
        $i++;
    }

    $datas[$dataKey] = json_encode($datas[$dataKey]);
    $filePath = './recognize-fish-ege-' . ($dataKey + 1) . 'c.json';
    file_put_contents($filePath, $datas[$dataKey]);
}




$data = json_encode($data);
//$filePath = '../test-data/copies/pdd-ege-' . $ticketNum . '-full.json';
//$filePath = '../test-data/iq/iq-ege-' . $ticketNum . '.json';
$filePath = './recognize-fish-ege-1b.json';

//file_put_contents($filePath, $data);

/*
$data = json_decode($data, true);
foreach($data['tasks'] as $key => $task) {
    $patterns = array();
    $patterns[] = '#\s<img.*?/>#s';
    $patterns[] = '#\s<a.*?/a>#s';
    $patterns[] = '#\s\d{1,2}\.\d{1,3}#';
    $string = $task['explanation'];
    $explanation = preg_replace($patterns, ' ', $string);
    $data['tasks'][$key]['explanation'] = $explanation;
}

$data = json_encode($data);
$filePath = '../test-data/copies/pdd-ege-' . $ticketNum . '.json';
file_put_contents($filePath, $data);*/

echo $filePath;

?>