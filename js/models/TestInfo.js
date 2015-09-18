//модель общей информации о тесте
var testApp = testApp || {};
testApp.TestInfo = Backbone.Model.extend({
    url: 'controllers/adminAjax2.php',
    initialize: function() {
        this.on("invalid", this.handleInvalid);
    },

    //валидация времени на выполнение теста
    validate: function(attrs) {
        console.log('validating TestInfo!!!', attrs);
        var messageArr = [];

        /*attrsToValidate = [attrs.test_hours, attrs.test_minutes, attrs.test_seconds];
        console.log('attrsToValidate', attrsToValidate);

        attrsToValidate.forEach(function(item, i) {
            console.log('doing validation2', item, i);
            if(!$.isNumeric(item)) messageArr.push('Время должно быть указано числами');
            if(item < 0) messageArr.push('Время не должно содержать отрицательных значений');
        });*/

        _.each(attrs.testTimerData, function(elem, index) {
            console.log('doing validation1', elem, index);
            if(elem !== '') {
                if (!$.isNumeric(elem)) messageArr.push('Время должно быть указано числами');
                if(elem < 0) messageArr.push('Время не должно содержать отрицательных значений');
            }
        });

        if(messageArr.length > 0) {
            messageArr.unshift('Валидация не пройдена:');
            message = messageArr.join('<br>');
            return message;
        }
    },

    //сохранение общей информации о тесте
    submitInfo: function(formDataObj) {
        console.log('admin Test sumbitTask', this, formDataObj);

        this.save(formDataObj, {
            wait: true,
            validate: true,
            url: 'controllers/adminAjax2.php',
            dataType: 'text',
            success: function(model, response, options) {
                //console.log('Successfully saved!', model, response, options);

                var successText = 'Данные записаны!';
                testApp.testEdit.testInfoSaved(successText);
            },
            error: function(model, error) {
                console.log('error logs', model, error);
            }
        });
    },

    //показывает ошибку валидации
    handleInvalid: function(model, error) {
        console.log('validation error in Task', model, error);
        testApp.testEdit.showInvalidTestInfo(error);
    },

    parse: function(data) {
        //console.log('parsing test info', data);
        var newData = {};
        _.each(data, function(item, i) {
            if(i !== 'tasks') newData[i] = item;
        });
        return newData;
    }
});