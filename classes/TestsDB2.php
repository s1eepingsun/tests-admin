<?php

class TestsDB
{
    public static $file = 'test-data/math1.json';
    public static $shortFile = 'test-data/math1-short.json';

    //возвращает данные теста
    public function getTestsData()
    {
        $file = self::$file;

        if(file_exists($file) && $data = file_get_contents($file)) {
            return $data;
        } else {
            return "couldn't get contents";
        }

    }

    //редактирует общие данные о тесте (описание, время на тест)
    public function setTestInfo($model)
    {
        $file = self::$file;
        $oldData = json_decode(file_get_contents($file), true);

        //сообщение на лендинге теста
        if($model['start_message'] != '') {
            $startMessage = $model['start_message'];
        } else if(!isset($oldData['start_message'])) {
            $startMessage = '';
        } else {
            $startMessage = $oldData['start_message'];
        }

        //описание теста
        if($model['description'] != '') {
            $description = $model['description'];
        } else if(!isset($oldData['description'])) {
            $description = '';
        } else {
            $description = $oldData['description'];
        }

        //описание теста в задаче
        if($model['in_task_description'] != '') {
            $inTaskDescription = $model['in_task_description'];
        } else if(!isset($oldData['in_task_description'])) {
            $inTaskDescription = '';
        } else {
            $inTaskDescription = $oldData['in_task_description'];
        }

        //время на тест
       /* $timerData = array();
        if(($model['test_hours'] != 0 || $model['test_minutes'] != 0 || $model['test_seconds'] != 0) &&
            ($model['test_hours'] != '' || $model['test_minutes'] != '' || $model['test_seconds'] != '')) {
            $timerData['h'] = intval($model['test_hours']);
            $timerData['m'] = intval($model['test_minutes']);
            $timerData['s'] = intval($model['test_seconds']);
        } else if(isset($oldData['testTimerData'])) {
            $timerData = $oldData['testTimerData'];
        } else {
            $timerData['h'] = 0;
            $timerData['m'] = 30;
            $timerData['s'] = 0;
        }*/

        //если время на выполнение теста не валидное, удалить его
        foreach($model['testTimerData'] as $key => $value) {
            if(!is_numeric($value) || $value == '') $value = 0;
            if($value < 0) $value = -$value;
            $model['testTimerData'][$key] = intval($value);
        }

        //записывает время числом (в миллисекундах)
        $timestamp = ($model['testTimerData']['test_seconds'] +
                $model['testTimerData']['test_minutes'] * 60 +
                $model['testTimerData']['test_hours'] * 3600) * 1000;

        $model['testTimerData'] = $timestamp;
        if(!is_numeric($timestamp) || $timestamp <= 0) unset($model['testTimerData']);


        //запись и перемещение ответов и баллов в отдельные массивы
        $oldData['start_message'] = $startMessage;
        $oldData['description'] = $description;
        $oldData['in_task_description'] = $inTaskDescription;
        $oldData['testTimerData'] = $model['testTimerData'];
        unset($oldData['timerData']);

        $newData = json_encode($oldData);

        //записывает данные в файл
        if(file_put_contents($file, $newData)) {
            echo $newData;
        } else {
            echo ' error, failed to fwrite test info';
        }

    }

    //редактирует задание если указан id, создаёт если не указан
    public function setTask($model)
    {
        $file = self::$file;

        $oldData = json_decode(file_get_contents($file), true);

        //установить id, если не указан
        if(!isset($model['id']) || strlen($model['id']) == 0 || $model['id'] == '') {
            if(isset($oldData) && is_array($oldData) && isset($oldData['tasks']) && count($oldData['tasks']) > 0) {
                $maxKey = max(array_keys($oldData['tasks']));
                $model['id'] = $maxKey + 1;
            } else {
                $model['id'] = 1;
                $oldData = array();
            }
        }
        $id = $model['id'];

        //удалить view_number т.к. иначе он не станет вычисляться из order_num
        unset($model['view_number']);

        //назначает порядок заданий order number
        if(!isset($model['order_num']) || strlen($model['order_num']) == 0) {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $task) {
                    $orderKeys[] = $task['order_num'];
                }
                $maxKey = max($orderKeys);
                $model['order_num'] = $maxKey + 1;
            } else {
                $model['order_num'] = 1;
                $oldData = array();
            }
        } else {
            if(isset($oldData) && count($oldData) > 0) {
                $orderKeys = array();
                foreach($oldData['tasks'] as $taskID => $task) {
                    $orderKeys[] = $task['order_num'];
                }
                //raise order_num of tasks with same or higher order_num
                if(in_array($model['order_num'], $orderKeys)) {
                    foreach($oldData['tasks'] as $key => $task) {
                        if($task['order_num'] >= $model['order_num']) {
                            $oldData['tasks'][$key]['order_num'] += 1;
                        }
                    }
                }
            } else {
                $model['order_num'] = 1;
                $oldData = array();
            }
        }

        //если время на выполнение задания не валидное, удалить его
        foreach($model['taskTimerData'] as $key => $value) {
            if(!is_numeric($value) || $value == '') $value = 0;
            if($value < 0) $value = -$value;
            $model['taskTimerData'][$key] = intval($value);
        }

        //записывает время числом (в миллисекундах)
        $timestamp = ($model['taskTimerData']['task_seconds'] +
                      $model['taskTimerData']['task_minutes'] * 60 +
                      $model['taskTimerData']['task_hours'] * 3600) * 1000;

        $model['taskTimerData'] = $timestamp;
        if(!is_numeric($model['taskTimerData']) || $model['taskTimerData'] <= 0) unset($model['taskTimerData']);


        $oldData['tasks'][$id] = $model;

        //возвращаемая модель для backbone.js
        $taskToReturn = json_encode($oldData['tasks'][$id]);

        $newData = json_encode($oldData);

        //write new data
        $fp = fopen($file, "w");

        if(fwrite($fp, $newData)) {
            fclose($fp);
            echo $taskToReturn;
        } else {
            echo 'error, failed to fwrite data<br>';
        }

    }

    //удаляет задание
    public function deleteTask($id)
    {
        $file = self::$file;
        $oldData = json_decode(file_get_contents($file), true);

        if(!$id > 0) exit("id isn't sent<br>");
        if(!isset($oldData) || !is_array($oldData) || !isset($oldData['tasks'])) exit("previous data is not found<br>");
        if(!isset($oldData['tasks'][$id])) exit("task data " . $id . " is not found<br>");

        unset($oldData['tasks'][$id]);

        $newData = json_encode($oldData);

        $fp = fopen($file, "w");
        if(fwrite($fp, $newData)) {
            fclose($fp);
            echo 'task ' . $id . ' deleted successfully!<br>';
        } else {
            echo 'failed to delete task<br> ' . $id;
        }

    }

    //убирает пробелы в индексах в order_num (порядковый номер)
    public function resetOrderValues() {
        $file = self::$file;
        if(file_exists($file)) {
            $oldData = json_decode(file_get_contents($file), true);
        } else {
            exit('file ' . $file . ' not found <br>');
        }

        //sorting tasks by order_num
        function compare($a, $b) {
            return $a['order_num'] - $b['order_num'];
        }

        uasort($oldData['tasks'], "compare");

        $sorted = array();
        $i = 1;
        foreach($oldData['tasks'] as $taskID => $task) {
            $oldData['tasks'][$task['id']]['order_num'] = $i;
            $sorted[$i] = $oldData['tasks'][$task['id']];
            $i++;
        }

        uasort($oldData['tasks'], "compare");


        //записать новые данные
//        $oldData['tasks'] = $sorted;
        $newData = json_encode($oldData);
        if(file_put_contents($file, $newData)) {
//            echo ' order_num values reset successfully! <br>';
        }  else {
            echo ' error, failed to fwrite data (reset order_num values)';
        }
    }

    //создает укороченную версию файла теста для клиента
    public function createShortVersion()
    {
        $file = self::$file;
        $shortFile = self::$shortFile;

        $oldData = json_decode(file_get_contents($file), true);
        if(!isset($oldData) || !is_array($oldData) || !isset($oldData['tasks'])) exit("previous data is not found<br>");

        //создает укороченную версию данных из полной
        $shortData = $oldData;
        foreach($shortData['tasks'] as $key => $task) {
            unset($shortData['tasks'][$key]['task_content']);
            unset($shortData['tasks'][$key]['answers']);
            unset($shortData['tasks'][$key]['type']);
            unset($shortData['description']);
            unset($shortData['in_task_description']);
        }
        $shortData = json_encode($shortData);

        if(file_put_contents($shortFile, $shortData)) {
            echo 'short version of test file has been created!<br>';
        } else {
            echo 'error, failed to fwrite short data<br>';
        }
    }

    //перевод времени из таймстампа (в миллисекундах) в массив
    public function timestampToArray($timestamp) {
        $timeArr = array();

        $seconds = $timestamp/1000;

        //hours
        $timeArr['h'] = [];
        if($seconds > 3600) {
            $timeArr['h'] = floor($seconds/3600);
            $seconds = $seconds%3600;
        }
        if(count( $timeArr['h']) == 0) $timeArr['h'] = 0;

        //minutes
        $timeArr['m'] = [];
        if($seconds > 60) {
            $timeArr['m'] = floor($seconds/60);
            $seconds = $seconds%60;
        }
        if(count( $timeArr['m']) == 0) $timeArr['m'] = 0;

        $timeArr['s'] = floor($seconds);

        return $timeArr;
    }


}
