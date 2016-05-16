/**
 * made for https://σχθρόσχθρό.πτ/testing/
 * use this code on test result page via console
 */

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

$('.block-testing-results-quest').each(function(i, task) {
    var num = i + 1;
    if(num == 30) {
        console.log('task: ' + num, $(task).attr('id'), task);
        var content = '';
        var nextIsAnswer = 0;
        var answerIndex = -1;
        window.taskk = task;

        $(task).find('.block-content').contents().each(function (j, item) {
            //console.log('items: ' + j, item);
            //console.log('node type', item.nodeType);

            if(item.nodeType == 1) {
                //console.log('node type == 1', item, $(item));
                if($(item).hasClass('variants')) {
                    console.log('item variants: ' + j, item);
                    $(item).children().each(function(k, itemV) {
                        var rightAnswer;
                        $(itemV).hasClass('green')? rightAnswer = 1: rightAnswer = 0;

                        console.log('itemV ' + rightAnswer + ':', $(itemV).text().trim());
                    })
                } else if(nextIsAnswer == 1) {
                    nextIsAnswer = 0;
                    answerIndex = j;
                    console.log('Answer index, text:', j, $(item).text(), $(item).html(), item);
                } else if($(item).hasClass('green-answer')) {
                    nextIsAnswer = 1;
                    console.log('task nextIsAnswer text:', $(item).text(), item);
                } else if($(item).hasClass('res-descr')) {
                    console.log('item res-descr: ' + j, item);
                } else if($(item).html() && $(item).html().trim() != '' && $(item).html() != '&nbsp;' && item != '<br>') {
                    console.log('item: ' + j, $(item).html());
                    if(typeof $(item).find('img').attr('src')  == 'string' && $(item).find('img').attr('src').length > 0) {
                        console.log('image src = ', $(item).find('img').attr('src'), $(item).find('img').attr('width'), $(item).find('img').attr('height'));
                        getImg(num, $(item).find('img').attr('src'));
                    }
                }
            } else if(item.nodeType == 3) {
                //console.log('node type == 3', item, $(item));
                if(nextIsAnswer == 1) {
                    nextIsAnswer = 0;
                    console.log('Answer node type == 3', item, $(item), $(item)['nodeValue']);
                }
            }


        });

        var allNodes = $(task).contents();

    }
});
