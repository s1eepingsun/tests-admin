/*console.log('loading', _gameVariationId, _userId, _username);
LogicGame.init(onInit);
function onInit(){
    console.log("init");
}*/

$(function() {
    //подключение редакторов для форм админки
    attachEditors();

    //регистрация хэлперов handlebars.js
    registerHandlebarsHelpers();

    //эмуляция REST и JSON
    Backbone.emulateHTTP = true;
    Backbone.emulateJSON = true;

    //инициализация теста, testApp - главный объект админки теста, он сознаёт namespace и запускает тест
    testApp.init();

    //file browser
    browser({
        contentsDisplay: document.getElementById("dvContents"),
        refreshButton: document.getElementById("btnrefresh"),
        pathDisplay: document.getElementById("pPathDisplay"),
        filter: document.getElementById("txtFilter"),
        openFolderOnSelect: true,
        onSelect: function (item, params) {
            if(item.type !== "folder") {
                console.log("You selected: " + item.path);
                var hostname = window.location.hostname;
                var pathname = window.location.pathname;
                testApp.file = item.path;
                var newURL = 'http://' + hostname + pathname + '?file=' + item.path;
                //newURL = encodeURIComponent(newURL);
                console.log("newURL:", newURL);
                //window.location = newURL;
                console.log('testApp.testTasks', testApp.testTasks);
                regexp = /(.+)\.\w+/;
                item.path = regexp.exec(item.path);
                console.log('after regexp:', item.path[1]);
                testApp.testTasks.url = 'controllers/adminAjax2.php' + '?file=' + item.path[1];

                testApp.testTasks.fetch({
                    dataType: 'text',
                    parse: true,
                    reset: true,
                    success: function (collection, response, options) {
                        console.log('fetch success', collection/*, response*/);
                        //var newData = $.parseJSON(collection);
                        //console.log('new data', newData);
                     },
                    error: function(collection, response, options){
                        console.log('fetch error', collection, response);
                    },
                    complete: function(xhr, textStatus) {
                       console.log(textStatus);
                    }
                });

                //testApp.testTasks.reset(testApp.testTasks);
                //testApp.testTasks.sync('read', testApp.testTasks);
                //testApp.taskListView.render();
                console.log('testApp.testTasks', testApp.testTasks);
            }
        },
        currentPath: ""
    });

    //Подключение mathjax
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
});


//инициализирует админку теста
testApp.init = function() {
    console.log('testApp', testApp);

    var filename = window.location.search.slice(1).split('=');
    console.log('filename:', filename[1]);
    testApp.file = filename[1];

    //инициализация коллекции заданий
    testApp.testTasks = new testApp.TestTasks(phpTestData, {parse: true});

    //создаёт модель общей инфы о тесте
    testApp.testInfo = new testApp.TestInfo(phpTestData, {parse: true});

    //подключение View списка задач
    testApp.taskListView = new testApp.TaskListView({model: testApp.testTasks});
    //$('#left-side-bar').html(testApp.taskListView.render().el);
    testApp.taskListView.setElement($('#left-side-bar'));

    //подключение View детального показа задач
    testApp.mainTestView = new testApp.MainTestView({model: testApp.testTasks});
    testApp.mainTestView.setElement($('.test-tasks'));

    //подключение View редактирования теста
    testApp.testEdit = new testApp.TestEdit({model: testApp.testInfo});
};

//модуль для кэша селекторов jquery
(function($){
    $.cache = function (selector) {
        if (!$.cache[selector]) {
            $.cache[selector] = $(selector);
        }

        return $.cache[selector];
    };
})(jQuery);

//регистрация хэлперов handlebars.js
function registerHandlebarsHelpers() {

    //для показа индекса, начинающегося с 1
    Handlebars.registerHelper('plus1', function(options) {
        return new Handlebars.SafeString(
            Number(options.fn(this)) + 1
        );
    });

    //математическая сумма элементов (для показа макс. баллов за задание)
    Handlebars.registerHelper('sum', function(context) {
        var sum = 0;
        var values = _.values(context);
        for(var i=0; i<values.length; i++) {
            sum += Number(values[i]);
        }
        return sum;
    });
}

//подключает редакторы
function attachEditors() {
    var CKFSYS_PATH='../../ckeditor/filemanager';

    var editor1 = CKEDITOR.replace( 'editor1', {
        // File manager
        filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            /* 	{ name: 'forms', groups: [ 'forms' ] }, */
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'insert', groups: [ 'insert' ] },
            '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
        ]
    });

    CKEDITOR.replace( 'editor-m1', {
        filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            /* 	{ name: 'forms', groups: [ 'forms' ] }, */
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'insert', groups: [ 'insert' ] },
            '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
        ]
    });

    CKEDITOR.replace( 'editor-d1', {
        filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            /* 	{ name: 'forms', groups: [ 'forms' ] }, */
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'insert', groups: [ 'insert' ] },
            '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
        ]
    });

    CKEDITOR.replace( 'editor-d2', {
        filebrowserBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        filebrowserImageBrowseUrl: CKFSYS_PATH+'/browser/default/browser.html?type=Image&Connector='+CKFSYS_PATH+'/connectors/php/connector.php',
        toolbarGroups: [
            { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
            { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
            /* 	{ name: 'forms', groups: [ 'forms' ] }, */
            { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
            { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
            { name: 'links', groups: [ 'links' ] },
            { name: 'insert', groups: [ 'insert' ] },
            '/',
            { name: 'styles', groups: [ 'styles' ] },
            { name: 'colors', groups: [ 'colors' ] },
            { name: 'tools', groups: [ 'tools' ] },
            { name: 'others', groups: [ 'others' ] },
            { name: 'about', groups: [ 'about' ] }
        ]
    });

    CKEDITOR.replace( 'editor-a1', {
        height: 40,
        toolbarCanCollapse: true,
        toolbarStartupExpanded : false,
        enterMode : CKEDITOR.ENTER_BR
    });
    CKEDITOR.replace( 'editor-a2', {
        height: 40,
        toolbarCanCollapse: true,
        toolbarStartupExpanded : false,
        enterMode : CKEDITOR.ENTER_BR
    });
    CKEDITOR.replace( 'editor-a3', {
        height: 40,
        toolbarCanCollapse: true,
        toolbarStartupExpanded : false,
        enterMode : CKEDITOR.ENTER_BR
    });
    CKEDITOR.replace( 'editor-a4', {
        height: 40,
        toolbarCanCollapse: true,
        toolbarStartupExpanded : false,
        enterMode : CKEDITOR.ENTER_BR
    });
    CKEDITOR.replace( 'editor-a5', {
        height: 40,
        toolbarCanCollapse: true,
        toolbarStartupExpanded : false,
        enterMode : CKEDITOR.ENTER_BR
    });
    CKEDITOR.replace( 'editor-a6', {
        height: 40,
        toolbarCanCollapse: true,
        toolbarStartupExpanded : false,
        enterMode : CKEDITOR.ENTER_BR
    });


}