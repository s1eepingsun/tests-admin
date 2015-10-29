//вьюшка окна детального отображения задач
var testApp = testApp || {};
testApp.MainTestView = Backbone.View.extend({
    initialize: function () {
        this.activeTaskID = 0;//задача активная в данный момет
        Backbone.on('test:showTask', this.showTask)
    },
    template: Handlebars.compile($('#test-main-tmpl').html()),

    //отображает шаблон детального окна задач
    render: function(id) {
        var that = this;
        var data = this.model;
        console.log('main view data', data);
        var rendered = this.template(data);
        $(this.el).html(rendered);

        //jquery hack - ждет пока отрендериться задание прежде чем отобразить его
        $(this.el).show(1, function() {
            console.log('render id', id);
            Backbone.trigger('test:showTask', id);
        });
        return this;
    },

    //показать задание
    showTask: function(id) {
        this.activeTaskID = id; //for active task id to be available for other functions
        console.log('mainTest show Task: ', id);
        console.log('mainTest this', this);
        $.cache('.start-message').hide();
        $('.single-test-data').hide();
        $('#vn' + id).show();
        $.cache('#field').find('.in-task-description').show();
    }

});
