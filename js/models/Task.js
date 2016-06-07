//модель задания
var testApp = testApp || {};
testApp.Task = Backbone.Model.extend({
    initialize: function() {
        var that = this;
        this.activeTaskID = 0;//задача активная в данный момет
        this.on("sync", this.syncViews);
        this.on("invalid", this.handleInvalid);
        //Backbone.on("test:selectTask", this.selectTask);
    },

    //валидация номера задания и балллов за ответы
    validate: function(attrs) {
        console.log('validating Task!!! this', this, attrs);
        var messageArr = [];

        _.each(attrs.answer_points, function(elem, index) {
            //console.log('doing validation1', elem, index);
            if(elem !== '') {
                if (!$.isNumeric(elem)) messageArr.push('Баллы за ответы должны быть числами');
            }
        });

        _.each(attrs.taskTimerData, function(elem, index) {
            //console.log('doing validation1', elem, index);
            if(elem !== '') {
                if (!$.isNumeric(elem)) messageArr.push('Время должно быть указано числами');
                if(elem < 0) messageArr.push('Время не должно содержать отрицательных значений');
            }
        });

        if(attrs.order_num !== '') {
            if(!$.isNumeric(attrs.order_num)) messageArr.push('Порядковый номер должен быть числом');
        }
        if(attrs.order_num < 0) messageArr.push('Порядковый номер должен быть положительным числом');

        if(messageArr.length > 0) {
            messageArr.unshift('Валидация не пройдена:');
            message = messageArr.join('<br>');
            return message;
        }
    },

    //синхронизирут отображение задач с новыми данными
    syncViews: function(model, response) {
        /**
        * on create model.id == '', so need to get it from response,
        * on delete trying to get id from response will produce an error, so need to take it from model
        * on change it's possible to get id using both methods
        */
            console.log('task sync');
        var id;
        if(model.id === '') {
            id = Number(JSON.parse(response).id);
            testApp.taskListView.render(id);
            console.log('model.id === "", id', id);
        } else {
            id = Number(model.id);
            testApp.taskListView.render(id);
            console.log('else id', id);
        }

        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        MathJax.Hub.Queue(["Rerender",MathJax.Hub]);
    },

    //сохранение задания
    submitTask: function() {
        this['attributes']['file'] = testApp.file;
        console.log('admin Test sumbitTask', this);

        this.save(this, {
            wait: true,
            validate: true,
            url: 'controllers/adminAjax2.php',
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully saved!', model, response, options);
                console.log('response', response);
                console.log('that.testTasks pre set: ', testApp.testTasks);
                var newModel = $.parseJSON(response);
                newModel.order_num = Number(newModel.order_num);

                var modelsLastIndex = testApp.testTasks.models.length - 1;
                var tasks = testApp.testTasks.models[modelsLastIndex].attributes.tasks;

                for(var taskIndex in tasks) {
                    if(!tasks.hasOwnProperty(taskIndex)) continue;

                    if(tasks[taskIndex].id == newModel.id) {
                        tasks[taskIndex] = newModel;
                    }
                }

                console.log('response object: ', newModel);
                testApp.testTasks.set(newModel, {remove: false});
                console.log('that.testTasks: ', testApp.testTasks);

                var successText = 'Данные записаны!';
                testApp.testEdit.taskSaved(successText);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //показывает ошибку валидации
    handleInvalid: function(model, error, options) {
        console.log('validation error in Task', model, error, options);
        testApp.testEdit.showInvalidTask(error);
    }
});