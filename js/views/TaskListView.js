//вьюшка списка задач
var testApp = testApp || {};
testApp.TaskListView = Backbone.View.extend({
    initialize: function() {
        Backbone.on('test:showTask', this.highlightTask);
    },
    template: Handlebars.compile($('#admin-task-list-tmpl').html()),
    events: {
        'click .task-item': 'taskClick'//клик на задачу на сайдбаре
    },

    //отображает шаблон списка задач
    render: function(id) {
        var data = this.model;
        console.log('--------------------- render data', data);
        var rendered = this.template(data);
        $(this.el).html(rendered);
        $(this.el).show(0, function() {
            $.cache('#left-side-bar').find('.task-item').removeClass('active-task');
            $('#qn' + id).addClass('active-task');
        });
        return this;
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
        console.log('taskListView id', id);
        console.log('taskListView this', this);
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