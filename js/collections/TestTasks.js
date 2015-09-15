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
        console.log('parsing tests collection', data);
        data = _.values(data.tasks);
        return data;
    },
    selectTask: function(id) {
        console.log('Task select id', id );
        Backbone.trigger('test:showTask', id);
    }
});