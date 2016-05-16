console.log('test', test);

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

var testCopy = JSON.parse(JSON.stringify(test));

console.log('testCopy', testCopy);

var pathObj = {};

for(task in test['tasks']) {
    if (!test['tasks'].hasOwnProperty(task)) continue;

    for (answer in test['tasks'][task]['answers']) {
        if (!test['tasks'][task]['answers'].hasOwnProperty(answer)) continue;

        answerString = test['tasks'][task]['answers'][answer];
        var filePath = regexp.exec(answerString);
        if(filePath) {
            if(!pathObj[task]) pathObj[task] = {};
            //console.log('answerString, filepath', answerString, filePath);
            pathObj[task][answer] = filePath[1];
        }

    }
}

console.log('pathObj', pathObj);

var imgsObj = {};

function getImg(task, answer, filePath) {
    if(!imgsObj[task]) imgsObj[task] = {};
    convertFileToBase64viaFileReader(filePath, function(base64Img){
        imgsObj[task][answer] = base64Img;
    });
}

for(task in pathObj) {
    if (!pathObj.hasOwnProperty(task)) continue;

    for (answer in pathObj[task]) {
        if (!pathObj[task].hasOwnProperty(answer)) continue;

        if(!imgsObj[task]) imgsObj[task] = {};

        //console.log('pathObj answer', pathObj[task][answer]);

        getImg(task, answer, pathObj[task][answer]);
    }
}

setTimeout(function() {
    for(task in imgsObj) {
        if (!imgsObj.hasOwnProperty(task)) continue;

        for (answer in imgsObj[task]) {
            if (!imgsObj[task].hasOwnProperty(answer)) continue;

            var answerImg = imgsObj[task][answer];
            var answerString = test['tasks'][task]['answers'][answer];
            var newString = answerString.replace(regexp, 'img src="' + answerImg + '"');
            //console.log('answerString', answerString, newString);
            test['tasks'][task]['answers'][answer] = newString;
        }
    }
}, 3000);



setTimeout(function() {
    console.log('final test', test);
    console.log('final imgsObj', imgsObj);

    $.post('../../../newtest2/controllers/makeJson.php',test, function(data) {
//            data = JSON.parse(data);
//            console.log('return data', data);
        console.log('---- data is saved ----');
    });
}, 4000);

