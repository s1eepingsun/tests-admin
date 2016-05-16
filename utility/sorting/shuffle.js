console.log('data', data);

var test = data;
var newTest = JSON.parse(JSON.stringify(test));
newTest['tasks'] = {};

_.each(test.tasks, function(task, index) {
    var id = task['id'];
    newTest['tasks'][id] = task;
});

//newTest['tasks'] = _.sortBy(newTest['tasks'], 'id');

/*window.i = 1;
_.each(test.tasks, function(task, index) {
    var id = task['id'];
    newTest['tasks'][window.i] = task;
    window.i++
});*/

var IDs = _.map(newTest['tasks'], function(task) {
    return task.id;
});

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

console.log('IDs', IDs);

IDs = shuffle(IDs);

console.log('IDs 2', IDs);

_.each(test.tasks, function(task, index) {
    console.log('index new ID', index, Number(index) - 1);
    newTest['tasks'][index]['order_num'] = IDs[Number(index) - 1];

});

console.log('newTest', newTest);




/*var minID = Array.min(IDs);
var mod = minID - 1;
console.log('IDs', minID, mod, IDs);
console.log('test', test);
console.log('newTest', newTest);*/

/*test['tasks'] = {};
_.each(newTest.tasks, function(task, index) {
    var id = task['id'] = task['order_num'] = task['order_num'] - mod;
    test['tasks'][id] = task;
});*/

console.log('test2', test);
    //console.log('final test', test);
    //console.log('final imgsObj', imgsObj);

$.post('./makeJson.php', newTest, function(data) {
//       data = JSON.parse(data);
//       console.log('return data', data);
    console.log('---- data is saved ----', data);
});


//перемешивает массив
function shuffle(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}


