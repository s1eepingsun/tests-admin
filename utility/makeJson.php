<?php
$data = $_REQUEST;
//$ticketNum = $data['ticket_num'];
//unset($data['ticket_num']);

//$data = json_encode($data);
//$filePath = '../test-data/copies/pdd-ege-' . $ticketNum . '-full.json';
//$filePath = '../test-data/iq/iq-ege-' . $ticketNum . '.json';

$filePath = './recognize-fish-ege-1.json';
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

echo $data;

?>