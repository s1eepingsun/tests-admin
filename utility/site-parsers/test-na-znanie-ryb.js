var testData = {
    "tasks": {},
    "start_message": "",
    "description": "",
    "in_task_description": "",
    "testTimerData": "1800000"
};

var answerPoints = {
    "answer1_points": "1",
    "answer2_points": "",
    "answer3_points": ""
};

window.convertFileToBase64viaFileReader = function (url, callback){
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
};

var imgsObj = {};

function getImg(id, filePath) {
    convertFileToBase64viaFileReader(filePath, function(base64Img){
        imgsObj[id]= base64Img;
    });
}

var resObj = {};
function getRess(i) {
    $.post("http://www.psiholocator.com/rowtests/test-rybakam-post.php", {otvet: i + 2, user:0, strotv: result_h2, postid:550},
        function(data, some1, some2) {
            //console.log('response data ' + result_h2, data, some2);
            res = some2.responseText;
            resObj[i] = some2.responseText;
        }
    );
}

var result_h2 = 's';
for(var i = 1; i < 77; i++) {
    result_h2 += '|' + (i + 1);
    getRess(i);
}

setTimeout(function() {
    var result_h2 = 's';

    for(i in resObj) {
        if(!resObj.hasOwnProperty(i)) continue;

        var answers = {};
        result_h2 += '|' + (i + 1);
        var j = 2;
        var qNum;

        var res = resObj[i];
        //console.log('res ' + i + ' -----------------------------------', res);
        $(res + 'input').each(function(i, item) {
            if($(item)[0]['name'] === 'hiddennum') {
                qNum = $(item).val();
                qNum = qNum.split('/');
                qNum = qNum[0];
                //console.log('qNum', qNum);
            }
        });

        $(res + 'input').each(function(i, item) {
            if($(item).find('input').val() == qNum -1) {
                answers['answer1'] = $(item).text().trim();
                //console.log('answer1', answers['answer1'], $(item).text(), $(item).find('input'));
            } else if($(item).find('input').attr('type') == 'radio') {
                answers['answer' + j] =  $(item).text().trim();
                //console.log('answer' + j, $(item).text(), $(item).find('input'));
                j++;
            }
        });

        var src = $(res).find('img').attr('src');

        getImg(i, src);

        testData['tasks'][i] = {
            'answer_points': answerPoints,
            'answers': answers,
            'task_content': src,
            'type': "",
            'order_num': i,
            'id': i
        };

    }


}, 5000);


setTimeout(function() {
    for(i in imgsObj) {
        if (!imgsObj.hasOwnProperty(i)) continue;

        if(typeof imgsObj[i] == 'string' && imgsObj[i].length > 0) {
            testData['tasks'][i]['task_content'] = '<p><img src="' + imgsObj[i] + '"></p>';
        } else {
            console.warn('couldn\'t get img ' + i);
        }

    }

    //$.post('localhost/tests-admin/utility/makeJson.php',test, function(data) {
//            data = JSON.parse(data);
//            console.log('return data', data);
//        console.log('---- data is saved ----');
//    });

    if(testData = JSON.stringify(testData)) {
        console.log('All done!');
        $('body').append('<div id="superclass"></div>');
        $('#superclass').append(testData);
    }

}, 10000);