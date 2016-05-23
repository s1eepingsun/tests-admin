//вьюшка блока редактирования общей инфы о тесте и отдельных заданий
var testApp = testApp || {};
testApp.TestEdit = Backbone.View.extend({
    el: '.editors-block',
    initialize: function () {
        var that = this;
        console.log('testEdit init');

        //заполняет формы общей информацией о тесте, когда все редакторы инициализированы
        this.a1 = $.Deferred();
        var editorsCount = 0;
        CKEDITOR.on('instanceReady', function() {
            editorsCount++;
            if(editorsCount == 10) {
                that.a1.resolve();
            }
        });

        $.when(this.a1).done(function() {
            that.showTestInfo();
        });

        Backbone.on('test:showTask', this.showTask)
    },
    events: {
        'click #task-form input[type="submit"]': 'submitTask',
        'click #task-form button.delete': 'deleteTask',
        'click #test-general-form input[type="submit"]': 'submitTestInfo',
        'click .create-new-task': 'clearTaskBlock',//clears all data, id & shows task block
        'click .edit-task-block': 'showTaskEditBlock',
        'click .edit-test-info': 'showTestInfoBlock'
    },

    //удаляет задание
    deleteTask: function(e) {
        var that = this;
        var id = $(e.currentTarget).parents('form').find('input[name="id"]').val();
        console.log('Delete id: ', id);
        console.log('this model: ', testApp.testTasks.get(id));
        var model = testApp.testTasks.get(id);
        if(typeof model === 'undefined') {
            var errorText = 'Ошибка: У сохраняемой модели нет id';
            this.showInvalidTask(errorText);
            return;
        }

        model.destroy({
            wait:true,
            dataType: 'text',
            success: function(model, response, options) {
                console.log('Successfully destroyed!', model, response, options);
                var successText = 'Задание удалено!';
                that.taskSaved(successText);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //отправляет данные задания из формы в модель для сохранения изменений
    submitTask: function(e) {
        var that = this;
        console.log('testEdit submit Task: ', this, e);
        console.log('size of collection: ', _.size(testApp.testTasks.models));

        //переносит данные из редактора ckeditor в поля textarea формы, без этого будут пустые строки вместо данных
        $.cache('#task-form').find('textarea.mce-content-body').each(function () {
            var textareaId = $(this).attr('id');
            var editorData = CKEDITOR.instances[textareaId].getData();
            $(this).val(editorData);
        });

        console.log('a1 submitTask done');

        var formDataArr = $.cache('#task-form').serializeArray();
        console.log('formDataArr : ', formDataArr);

        //запись данных из формы в объект
        var formDataObj = {};
        formDataObj['answers'] = {};
        formDataObj['collateAnswers'] = [];
        formDataObj['answer_points'] = {};
        formDataObj['taskTimerData'] = {};
        formDataObj['collateTo'] = [];
        var expr1 = /^answer[0-9]$/;
        var expr2 = /answer[0-9]_points$/;
        var expr3 = /^collate-answer[0-9]$/;
        var expr4 = /^collate-to[0-9]$/;

        formDataArr.forEach(function(item) {
            if (expr1.test(item.name)) {
                console.log('expr1 item', item);
                if (item.value != '') {
                    item.value = that.inlineMathToBlock(item.value);//заменить инлайновый mathjax на блочный
                    formDataObj['answers'][item.name] = item.value;
                }
            } else if(expr3.test(item.name)) {
                console.log('expr3 item', item);
                if(item.value != '') {
                    var itemIndex = Number(item.name.substring(14)) - 1;
                    item.value = that.inlineMathToBlock(item.value);
                    formDataObj['collateAnswers'][itemIndex] = item.value;
                }
            } else if(expr2.test(item.name)) {
                //console.log('expr2 item', item);
                //if (item.value != '' && item.value != 0) {
                    item.value = item.value.replace(/\s+/g, "");//убирает пробелвы в числах
                    formDataObj['answer_points'][item.name] = item.value;
                //}
            } else if(item.name === 'task_hours') {
                formDataObj['taskTimerData']['task_hours'] = item.value;
            } else if(item.name === 'task_minutes') {
                formDataObj['taskTimerData']['task_minutes'] = item.value;
            } else if(item.name === 'task_seconds') {
                formDataObj['taskTimerData']['task_seconds'] = item.value;
            } else if(!expr4.test(item.name)) {
                formDataObj[item.name] = item.value;
            }

            //formDataObj['taskTimerData'] = timer.timeObToTimestamp(timerObj);
        });

        formDataArr.forEach(function(item) {
            if(expr4.test(item.name)) {
                console.log('expr4 item', item);
                var itemIndex = Number(item.name.substring(10)) - 1;
                if (item.value != '' && item.value != 0 &&
                    formDataObj['collateAnswers'][itemIndex] &&
                    formDataObj['collateTo'].indexOf(item.value) == -1 &&
                    formDataObj['answers']['answer' + item.value]) {
                    formDataObj['collateTo'][itemIndex] = item.value;
                }
            }
        });

        if(formDataObj['collateAnswers'].length == 0) delete formDataObj['collateAnswers'];
        if(formDataObj['collateTo'].length == 0) delete formDataObj['collateTo'];

        //убирает пробелвы в порядкковом номере
        formDataObj['order_num'] = formDataObj['order_num'].replace(/\s+/g, "");

        console.log('formDataObj ', formDataObj);
        var newTask = new testApp.Task(formDataObj);
        newTask.submitTask();
    },

    //заменить инлайновый mathjax на блочный (в нем font-size одинаковый у всех элементов)
    //делается заменой /( и /) на /[ и /]
    inlineMathToBlock: function(string) {
        var expr = /\\\)/g;
        var expr2 = /\\\(/g;
        string = string.replace(expr, '\\\]');
        string = string.replace(expr2, '\\\[');
        return string;
    },

    //отправляет общие данные теста из формы в модель для сохранения на сервер
    submitTestInfo: function(e) {
        var that = this;
        console.log('testEdit submit test info: ', this, e);
        console.log('size of collection: ', _.size(testApp.testTasks));
        console.log('submitTestInfo a1 before Timeout', that.a1.state(),  this.a1);

        //переносит данные из редактора ckeditor в поля textarea формы, без этого будут пустые строки вместо данных
        $.cache('#test-general-form').find('textarea.mce-content-body').each(function () {
            var textareaId = $(this).attr('id');
            var editorData = CKEDITOR.instances[textareaId].getData();
            console.log('textareaId', textareaId);
            console.log(editorData);
            $(this).val(editorData);
        });

        console.log('submitTestInfo a1 after Timeout', that.a1.state(), that.a1);
        var formDataArr = $.cache('#test-general-form').serializeArray();
        console.log('formDataArr : ', formDataArr);

        //запись данных из формы в объект
        var formDataObj = {testTimerData: {}};
        formDataArr.forEach(function (item) {
            if(item.name === 'test_hours') {
                formDataObj['testTimerData']['test_hours'] = item.value;
            } else if(item.name === 'test_minutes') {
                formDataObj['testTimerData']['test_minutes'] = item.value;
            } else if(item.name === 'test_seconds') {
                formDataObj['testTimerData']['test_seconds'] = item.value;
            } else {
                formDataObj[item.name] = item.value;
            }
        });
        if (formDataObj.id == '') delete formDataObj.id;
        console.log('formDataObj ', formDataObj);

        //убирает пробелы в числах
        /*formDataObj.test_hours = formDataObj.test_hours.replace(/\s+/g, "");
        formDataObj.test_minutes = formDataObj.test_minutes.replace(/\s+/g, "");
        formDataObj.test_seconds = formDataObj.test_seconds.replace(/\s+/g, "");*/

        //сохранение новых данных
        testApp.testInfo.submitInfo(formDataObj);
    },

    //заполняет форму редактирования задания данными задания id
    showTask: function(id) {
        console.log('testEdit show Task: ', id);
        console.log('testEdit this: ', this);
        //if(typeof testApp.testTasks.get(id) === 'undefined') return;
        //var data = testApp.testTasks.get(id)['attributes'];
        if(testApp.testTasks.models[0].attributes.tasks) {
            //var data = testApp.testTasks.models[0].attributes.tasks[id];
            var data = _.find(testApp.testTasks.models[0].attributes.tasks, function(task) {
                return task['id'] == id;
            })
        } else {
            data = testApp.testTasks.models[0].attributes[id];
            if(typeof(data) === 'undefined') {
                data = testApp.testTasks.models[0].attributes;
            }
        }

        console.log('showTask() data', data);

        for(var i = 1; i <= 6; i++) {
            var ckEditorID = '#cke_editor-a' + i;
            $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html('');

            ckEditorID = '#cke_editor-c' + i;
            $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html('');
        }

        for (var property in data.answers) {
            if (data.answers.hasOwnProperty(property)) {
                var answerID = property.substring(6);
                ckEditorID = '#cke_editor-a' + answerID;
                $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html(data.answers[property]);
            }
        }


        if(data.collateAnswers) {
            data.collateAnswers.forEach(function(elem, i) {
                ckEditorID = '#cke_editor-c' + (i + 1);
                $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html(elem);
            });
        }

        if(data.collateTo) {
            data.collateTo.forEach(function(elem, i) {
                $('#task-form').find('select[name="collate-to' + (i + 1) + '"]').val(elem);
            });
        }


        /*for(i = 1; i <= 6; i++) {
            ckEditorID = '#cke_editor-a' + i;
            $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html('');
        }

        for (property in data.answers) {
            if (data.answers.hasOwnProperty(property)) {
                answerID = property.substring(6);
                ckEditorID = '#cke_editor-a' + answerID;
                $(ckEditorID + ' .cke_wysiwyg_frame').contents().find('body').html(data.answers[property]);
            }
        }*/

        for(property in data.answer_points) {
            if (data.answer_points.hasOwnProperty(property)) {
                $.cache('#task-form').find('input[name="' + property + '"]').val(data.answer_points[property]);
            }
        }

        //записывает время на выполнение теста
        console.log('typeof data.taskTimerData != undefined', typeof data.taskTimerData != 'undefined');
        if(typeof data.taskTimerData != 'undefined') {
            var timer = new Timer();

            //if timestamp make an object
            if(typeof data.taskTimerData == 'number') {
                data.taskTimerData = timer.timeToObject(data.taskTimerData);
            }

            for(property in data.taskTimerData) {
                if (data.taskTimerData.hasOwnProperty(property)) {
                    console.log('taskTimerData property', property);
                    switch(property) {
                        case 'h':
                            $.cache('#task-form').find('input[name="task_hours"]').val(data.taskTimerData[property]);
                            break;
                        case 'm':
                            $.cache('#task-form').find('input[name="task_minutes"]').val(data.taskTimerData[property]);
                            break;
                        case 's':
                            $.cache('#task-form').find('input[name="task_seconds"]').val(data.taskTimerData[property]);
                            break;
                    }
                }
            }
        } else {
            $.cache('#task-form').find('input[name="task_hours"]').val('');
            $.cache('#task-form').find('input[name="task_minutes"]').val('');
            $.cache('#task-form').find('input[name="task_seconds"]').val('');
        }

        if(data.answers_view) {
            $.cache('#task-form').find('.answer-view select').val(data.answers_view);
        } else {
            $.cache('#task-form').find('.answer-view select').val('default');
        }

        if(data.points_counting_method) {
            $.cache('#task-form').find('.points-counting-method select').val(data.points_counting_method);
        } else {
            $.cache('#task-form').find('.points-counting-method select').val('default');
        }

        $.cache('#task-form').find('input[name="order_num"]').val(data.order_num);
        $.cache('#task-form').find('input[name="type"]').val(data.type);
        $.cache('#cke_editor1').find('.cke_wysiwyg_frame').contents().find('body').html(data.task_content);
        $.cache('#task-form').find('input[type="hidden"]').val(data.id);
        $.cache('#task-form').find('input[name="soundfile"]').val(data.soundfile);

        testApp.testEdit.showTaskEditBlock();
    },

    //заполняет форму редактирования общих данных о тесте
    showTestInfo: function() {
        var data = testApp.testInfo.attributes;
        var timer = new Timer();
        console.log('showTestInfo ', data);

        $.cache('#cke_editor-d1').find('.cke_wysiwyg_frame').contents().find('body').html(data.description);
        $.cache('#cke_editor-d2').find('.cke_wysiwyg_frame').contents().find('body').html(data.in_task_description);
        $.cache('#cke_editor-m1').find('.cke_wysiwyg_frame').contents().find('body').html(data.start_message);
        $.cache('.test-title').find('input').val(data.test_title);

        data.testTimerData = timer.timeToObject(data.testTimerData);
        $.cache('#test-general-form').find('input[name="test_hours"]').val(data.testTimerData.h);
        $.cache('#test-general-form').find('input[name="test_minutes"]').val(data.testTimerData.m);
        $.cache('#test-general-form').find('input[name="test_seconds"]').val(data.testTimerData.s);

        //убрирает показ ошибки валидации задания
        $.cache('#task-form').find('.response').hide();
    },

    //показ ошибок валидации в задаче
    showInvalidTask: function(error) {
        console.log('Ошибка валидации: ', error);
        $.cache('#task-form').find('.response').html(error);
        $.cache('#task-form').find('.response').show();
    },

    //показ ошибок валидации в общей информации о тесте
    showInvalidTestInfo: function(error) {
        console.log('Ошибка валидации: ', error);
        $.cache('#test-general-form').find('.response').html(error);
        $.cache('#test-general-form').find('.response').show();
    },

    //показывает что данные записаны успешно
    taskSaved: function(successText) {
        $.cache('#task-form').find('.response').html(successText);
        $.cache('#task-form').find('.response').show();
    },

    //показывает что данные записаны успешно
    testInfoSaved: function(successText) {
        $.cache('#test-general-form').find('.response').html(successText);
        $.cache('#test-general-form').find('.response').show();
    },

    //показывает блок редактирования общих данных о тесте
    showTestInfoBlock: function() {
        $('#task-form').hide();
        $('#test-general-form').show();
    },

    //показывает блок редактирования задания
    showTaskEditBlock: function() {
        $.cache('#task-form').show();
        $.cache('#test-general-form').hide();
    },

    //обнуляет данные в форме редактирования задания (включая id)
    clearTaskBlock: function() {
        $.cache('#cke_editor1').find('.cke_wysiwyg_frame').contents().find('body').html('');
        $.cache('#task-form').find('input[name="order_num"]').val('');
        $.cache('#task-form').find('input[name="type"]').val('');
        $.cache('#task-form').find('input[type="hidden"]').val('');//обнуляет id
        for(var i = 1; i<=6; i++) {
            $('#cke_editor-a' + i).find('.cke_wysiwyg_frame').contents().find('body').html('');
            $.cache('#task-form').find('input[name="answer' + i + '_points"]').val('');
        }

        //показывает блок редактирования задания
        $.cache('#task-form').show();
        $.cache('#test-general-form').hide();
    }

});