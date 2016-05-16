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


var minID = Array.min(IDs);
var mod = minID - 1;
console.log('IDs', minID, mod, IDs);
console.log('test', test);
console.log('newTest', newTest);

test['tasks'] = {};
_.each(newTest.tasks, function(task, index) {
    var id = task['id'] = task['order_num'] = task['order_num'] - mod;
    test['tasks'][id] = task;
});

console.log('test2', test);
    //console.log('final test', test);
    //console.log('final imgsObj', imgsObj);

$.post('./makeJson.php', test, function(data) {
//       data = JSON.parse(data);
//       console.log('return data', data);
    console.log('---- data is saved ----');
});


