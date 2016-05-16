//коллекция заданий
var testApp = testApp || {};
testApp.TestTasks = Backbone.Collection.extend({
    model: testApp.Task,
    url: 'controllers/adminAjax2.php',
    comparator: 'order_num',
    initialize: function() {
        this.on("test:selectTask", this.selectTask);
    },
    parse: function(data) {
        if(typeof data === 'string') {
            //console.log('data', data);
            respObj = JSON.parse(data);
            var tasks = respObj['tasks'];
            console.log('data is string, parsed:', tasks);
            return tasks;
        }
        //data = JSON.parse(data);
        console.log('typeof?:',  typeof data, data.length);
        console.log('parsing tests collection', data);
        //data = _.values(data.tasks);
        //console.log('after parsing tests collection', data);
        return data;
    },
    selectTask: function(id) {
        console.log('Task select id', id );
        Backbone.trigger('test:showTask', id);
    }
});