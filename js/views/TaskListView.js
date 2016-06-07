//вьюшка списка задач
var testApp = testApp || {};
testApp.TaskListView = Backbone.View.extend({
    initialize: function() {
        Backbone.on('test:showTask', this.highlightTask);
        this.model.bind('reset', this.renderAll);
        _.bindAll(this, 'renderAll');
    },
    template: Handlebars.compile($('#admin-task-list-tmpl').html()),
    events: {
        'click .task-item': 'taskClick'
    },

    //отображает шаблон списка задач
    render: function(id) {
        console.log('render id', id, this);
        var data = {models: {attributes: {}}};
        //data.models.attributes = this.model['models'][1]['attributes']['tasks'];
        var lastElemIndex = this.model['models'].length - 1;
        data.models.attributes = this.model['models'][lastElemIndex]['attributes']['tasks'];

        //data = this.model;
        console.log('--------------------- render data', id, this.model, data);
        var rendered = this.template(data);
        $(this.el).html(rendered);
        $(this.el).show(0, function() {
            $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
            $('#qn' + id).addClass('active-task');
        });
        return this;
    },

    renderAll: function() {
        var data = this;
        console.log('TaskListView render data', data);
        var template = Handlebars.compile($('#admin-task-list-tmpl').html());
        var rendered = template(data);
        $.cache('#left-side-bar').html(rendered);
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
    },

    //клик на задание определяет id и вызывает selectTask
    taskClick: function(e) {
        console.log('selectTask2', e);
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);
        this.selectTask(id);
    },

    //выбор задачи
    selectTask: function(id) {
        console.log('taskListView id, this', id, this);
        console.log('testApp', testApp.testTasks);

        //передаёт обработчик в модель
        testApp.testTasks.trigger('test:selectTask', id);
    },

    //подсвечивает задание
    highlightTask: function(id) {
        $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
    }

   /* //клик по задаче на сайдбаре
    selectTask: function(e) {
        console.log('selectTask2', e);
        var element = e.target;
        var id = $(element).parent().attr('id');
        id = id.substring(2);
        console.log('taskListView id', id);
        console.log('taskListView this', this);
        console.log('testApp', testApp.testTasks);

        testApp.testTasks.trigger('test:selectTask', id);

        $('#left-side-bar').find('.task-item').removeClass('active-task');
        $('#qn' + id).addClass('active-task');
    }*/
});