<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Конвертация iq</title>
    <script src="../js/libs/jquery-1.11.3.min.js"></script>
    <script src="../js/libs/underscore-min.js"></script>

<?php

$answers = file_get_contents('./answers.json');
$answers = json_decode($answers, true);

$questions = file_get_contents('./questions.json');
$questions = json_decode($questions, true);

$answer_variants = file_get_contents('./answer_variants.json');
$answer_variants = json_decode($answer_variants, true);


$tasks1 = array();
$tasks2 = array();
$tasks3 = array();
$tasks4 = array();

foreach($questions as $task) {
    $id = $task['id'];
    $testNum = $task['test_num'];
    switch($testNum) {
        case 'Test_1':
            $tasks1[$id] = $task;
            break;
        case 'Test_2':
            $tasks2[$id] = $task;
            break;
        case 'Test_3':
            $tasks3[$id] = $task;
            break;
        case 'Test_4':
            $tasks4[$id] = $task;
            break;
    }
}
sort($tasks1);
sort($tasks2);
sort($tasks3);
sort($tasks4);

$allTasks = array('tasks1' => $tasks1, 'tasks2' => $tasks2, 'tasks3' => $tasks3, 'tasks4' => $tasks4);

//get tasks id to start from 1
foreach($allTasks as $tasksKey => $tasks) {
    $newTasks = array();
    foreach($tasks as $key => $task) {
        $newTasks[$key + 1] = $task;
    }
    $allTasks[$tasksKey] = $newTasks;
}



foreach($allTasks as $tasksKey => $tasks) {
    foreach($tasks as $key => $task) {
        $id = $task['id'];
        $allTasks[$tasksKey][$key]['order_num'] = $id;

        $allTasks[$tasksKey][$key]['correct_answer'] = $answers[$id]['correct_answer'];
        $correctID = $answers[$id]['correct_answer'];

        $allTasks[$tasksKey][$key]['answer_points']['answer1_points'] = 1;
        $allTasks[$tasksKey][$key]['answer_points']['answer2_points'] = 0;
        $allTasks[$tasksKey][$key]['answer_points']['answer3_points'] = 0;
        $allTasks[$tasksKey][$key]['answer_points']['answer4_points'] = 0;
        $allTasks[$tasksKey][$key]['answer_points']['answer5_points'] = 0;
        $allTasks[$tasksKey][$key]['answer_points']['answer6_points'] = 0;


        $answersArr = array();
        foreach($answer_variants as $variant) {
            if($variant['question_id'] == $id) {
                isset($allTasks[$tasksKey][$key]['i'])? $i = $allTasks[$tasksKey][$key]['i']: $i = 2;
                if($variant['answer_id'] === $correctID) {
                    $answerNum = 'answer1';
                } else {
                    $answerNum = 'answer' . $i;
                    $i++;
                }

                $answersArr[$answerNum] = $variant['answer_content'];
                $allTasks[$tasksKey][$key]['i'] = $i;
            }
        }
        $allTasks[$tasksKey][$key]['answers'] = $answersArr;

    }

}

foreach($allTasks as $tasksKey => $tasks) {
    foreach ($tasks as $key => $task) {
        unset($allTasks[$tasksKey][$key]['i']);
        unset($allTasks[$tasksKey][$key]['correct_answer']);
    }
}


$allData = array();
foreach($allTasks as $tasksKey => $tasks) {
    $properTasks = array('tasks' => $tasks);
    $encodedData = json_encode($properTasks);
    $allData[$tasksKey] = $properTasks;



    /*if(file_put_contents($tasksKey . '.json', $encodedData)) {
//        echo $encodedData;
        echo 'saved successfully';
    } else {
        echo ' error, failed to fwrite data';
    }*/
}
$allData = json_encode($allData);





echo '<pre>';

//print_r($allTasks['tasks1']);
//print_r($tasks3);
echo '<br>';

/*echo '<br><strong>QUESTIONS:</strong><br>';
print_r($questions[0]);
echo '<br><strong>ANSWER VARIANTS:</strong><br>';
print_r($answer_variants[0]);
print_r($answer_variants[1]);
//print_r($answer_variants[2]);
//print_r($answer_variants[3]);
echo '<br><strong>ANSWERS:</strong><br>';
print_r($answers[0]);*/

echo '</pre>';
?>

<script>
    var dataObj = <?=$allData?>;
    console.log('dataObj', dataObj);

    function convertFileToBase64viaFileReader(url, callback){
        var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = function() {
            var reader  = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.send();
    }



    regexp = /img\ssrc=\"([\w\/\.]+)\??\w*\"/;
    var imgsArr = [];

    function getNewSrc(data) {
        var filePath = regexp.exec(data.string);
        console.log('string', data.string);
        if(filePath) {
            var regex2 = /\.png$/;
            filePath[1] = filePath[1].replace(regex2, '.jpg');

            console.log('filePath', filePath);
            return convertFileToBase64viaFileReader(filePath[1], function(base64Img){
                setTimeout(function() {
                var newString = data.string.replace(regexp, 'img src="' + base64Img + '"');
                console.log('coversion done', data.dataObj.prop, data.dataObj.test, newString);
//                imgsObj[data.dataObj.prop][data.dataObj.test][data.dataObj.task]['task_content'] = newString;
//                if(!imgsObj[data.dataObj.prop]) imgsObj[data.dataObj.prop]
                imgsArr.push({
                    newString: newString,
                    prop: data.dataObj.prop,
                    test: data.dataObj.test,
                    task: data.dataObj.task});

                console.log('imgsArr', imgsArr);

                    return newString;
                }, 1000);

            });

        } else {
            return null;
        }
    }

    var dataPre = [];

    for(prop in dataObj) {
        if(!dataObj.hasOwnProperty(prop)) continue;

        for(test in dataObj[prop]) {
            if(!dataObj[prop].hasOwnProperty(test)) continue;

//            console.log('test', dataObj[prop][test]);

            for(task in dataObj[prop][test]) {
                if(!dataObj[prop][test].hasOwnProperty(task)) continue;

               /* dataPre.push({
                    task_content: dataObj[prop][test][task]['task_content'],
                    prop: prop,
                    test: test,
                    task: task});*/

                dataPre.push([dataObj[prop][test][task]['task_content'], prop, test, task]);

                console.log('task', dataObj[prop][test][task]);
                var string = dataObj[prop][test][task]['task_content'];
                var newString2 = getNewSrc({string: string, dataObj: {prop, test, task}});

                var filePath = regexp.exec(string);

                /*$.when(newString = convertFileToBase64viaFileReader(filePath[1], function(base64Img){
                    var newString = data.string.replace(regexp, 'img src="' + base64Img + '"');
                    console.log('coversion done', newString);
                    console.log('dataObj', data.dataObj);
                    data.dataObj = newString;
                    return newString;
                })).then(function(data, status, xhr) {
                    console.log('then', data, status, xhr);
                });*/

                $.when(newString2 = getNewSrc(string)).then(function(data, status, xhr) {
                    console.log('then', data, status, xhr);
                    console.log('newString', newString2);
                    if(newString2 !== null) {
                        dataObj[prop][test][task]['task_content'] = newString2;
                        console.log('new task content', dataObj[prop][test][task]['task_content']);
                    } else {
                        console.log('new string === null');
                    }
                });



                /*console.log('newString', newString2);
                if(newString2 !== null) {
                    dataObj[prop][test][task]['task_content'] = newString2;
                    console.log('new task content', dataObj[prop][test][task]['task_content']);
                } else {
                    console.log('new string === null');
                }*/


            }

        }

//        console.log(prop, dataObj[prop]);
    }


    /*dataPre.forEach(function(item, i) {
//        console.log('item', i, item);
        var filePath = regexp.exec(item[0]);
        if(filePath) {
            console.log('filePath', filePath);
            return convertFileToBase64viaFileReader(filePath[1], function (base64Img) {

            });
        }
    });*/

    setTimeout(function() {
        console.log('final dataArr timeout', imgsArr);

        imgsArr.forEach(function(item, i) {
            dataObj[item.prop][item.test][item.task]['task_content'] = item['newString'];
        });


        for(prop in dataObj) {
            if (!dataObj.hasOwnProperty(prop)) continue;

            dataObj[prop]['start_message'] = '';
            dataObj[prop]['description'] = '';
            dataObj[prop]['in_task_description'] = '';
            dataObj[prop]['testTimerData'] = '1800000';
            dataObj[prop]['ticket_num'] = prop;

            $.post('../../newtest2/controllers/makeJson.php', dataObj[prop], function(data) {
                data = JSON.parse(data);
                console.log('return data', data);
            });

        }





        console.log('final dataArr', dataObj, imgsArr);
    //    console.log('dataPre', dataPre);

    }, 5000);
</script>

</head>
<body>
</body>
</html>