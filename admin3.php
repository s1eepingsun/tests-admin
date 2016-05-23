<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Tests Admin</title>
    <link rel="icon" href="http://getbootstrap.com/favicon.ico">
    <script src="./Example_files/openapi.js" type="text/javascript"></script>
    <script type="text/javascript" src="./Example_files/public-main.min.js"></script>
    <!-- <script type="text/javascript" src="./Example_files/shared-main.js"></script>-->
    <!-- <script type="text/javascript" src="./Example_files/lang.ru.js"></script>-->

    <!-- styles -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link media="screen" href="./Example_files/shared.css" rel="stylesheet" type="text/css">
    <link media="screen" href="./Example_files/game-layout.css" rel="stylesheet" type="text/css">
    <link media="screen" href="css/test-main.css" rel="stylesheet" type="text/css">
    <link href="css/admin3.css" rel="stylesheet" type="text/css">
    <link href="css/file-browser.css" rel="stylesheet" type="text/css">
    <link href="css/jqueryFileTree.css" rel="stylesheet" type="text/css">


    <!-- assigning php data to js variable -->
    <?php include 'controllers/testDataToJS.php'; ?>

    <!-- handlebars templates -->
    <script id="admin-task-list-tmpl" type="text/x-handlebars-template">
        <?php include 'tmpl/side-bar-admin.hbs'; ?>
    </script>
    <script id="test-main-tmpl" type="text/x-handlebars-template">
        <?php include 'tmpl/test-main2.hbs'; ?>
    </script>

    <!-- thrid-party libraries -->
    <script src="js/libs/bootstrap.min.js"></script>
    <script src="js/libs/ie10-viewport-bug-workaround.js"></script><!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script type="text/javascript" src="../ckeditor/ckeditor.js"></script>
    <script type="text/javascript" src="js/libs/handlebars-v3.0.3.js"></script>
    <script type="text/javascript" src="js/libs/underscore-min.js"></script>
    <script type="text/javascript" src="js/libs/backbone.js"></script>
    <script type="text/javascript" src="../mathjax/MathJax.js?config=TeX-AMS_HTML"></script>
    <script type="text/javascript" src="js/file-browser/ajax.js"></script>
    <script type="text/javascript" src="js/file-browser/browser.js"></script>
    <script type="text/javascript" src="js/libs/jquery.easing.js"></script>
    <script type="text/javascript" src="js/libs/jqueryFileTree.js"></script>

    <!-- modules -->
    <script type="text/javascript" src="js/Timer.js"></script>
    <script type="text/javascript" src="js/models/Task.js"></script>
    <script type="text/javascript" src="js/models/TestInfo.js"></script>
    <script type="text/javascript" src="js/collections/TestTasks.js"></script>
    <script type="text/javascript" src="js/views/MainTestView.js"></script>
    <script type="text/javascript" src="js/views/TaskListView.js"></script>
    <script type="text/javascript" src="js/views/TestEdit.js"></script>

    <!-- application core (should be positioned after modules) -->
    <script src="js/admin3.js"></script>
</head>
<body>

<div class="container">
    <div class="row">
            <div class="col-xs-6 col-sm-2" id="left-side-bar">
                <?php include 'controllers/adminTaskList.php'; ?>
            </div>
            <div class="col-xs-6 col-sm-5 test-preview">
                <!-- TOP LINKS -->
                <div class="titleBand">
                    <div class="titleBandInner">
                        <table cellspacing="0" cellpadding="0" width="100%" border="0">
                            <tbody><tr>
                                <td width="1%" style="white-space: nowrap;">
                            <span class="titleBandLink" id="title">Математика</span></td>

                                <td>&nbsp;</td>

                                <td width="1%" align="center" style="white-space: nowrap;">
                            <span class="titleBandLink" id="showDescription">
                                Описаниие
                            </span>
                                </td>

                                <td>&nbsp;</td>

                                <td width="1%" align="center" style="white-space: nowrap;">
                            <span id="gbShow" class="titleBandLink">
                                Вопросы и отзывы
                            </span>
                                </td>

                                <td>&nbsp;</td>

                                <td width="1%" align="right" style="white-space: nowrap;">
                                    <a href="http://logic-games.spb.ru/" class="titleBandLink">
                                        Перейти на другие игры
                                    </a>
                                </td>
                            </tr>
                            </tbody></table>
                    </div>
                </div>

                <!-- TOP BUTTONS -->
                <div class="controlPanel top-c-panel nonSelectable">
                    <table class="controlPanelLayout" cellpadding="0">
                        <tbody>
                            <tr>
                                <td id="tb-prev-task" class="cpButton cpNormal nonSelectable disabled">Предыдущий вопрос</td>
                                <td id="tb-next-task" class="cpButton cpNormal nonSelectable  disabled">Следующий вопрос</td>
                                <td id="tbNewGameContainer" class="cpButton cpNormal nonSelectable cpKillHover">
                                    <table style="width: 100%; height: 100%;" cellspacing="0" cellpadding="0">
                                        <tbody><tr>
                                            <td id="tb-new-test" class="cpNormal roundedRight4px">Новый тест</td>
                                        </tr>
                                        </tbody></table>
                                </td>
                                <td id="tb-finish-test" class="cpButton cpNormal nonSelectable disabled">Закончить тест</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- GAME FIELD !! важно чтобы был див с таким айдишников и центрированием, относительного него и будет центрироваться блок с авторизацией !!-->
                <div id="field">
                    <?php include 'controllers/adminMain.php'; ?>
                </div>
            </div>

            <div class="col-xs-6 col-sm-5 editors-block">
                <div class="result">
                    <!--<h3>Новое задание для теста:</h3>-->
                    <button type="button" class="btn btn-primary create-new-task">Создать новое задание</button>
                    <button type="button" class="btn btn-primary edit-task-block">Редактор заданий</button>
                    <button type="button" class="btn btn-primary edit-test-info">Редактор общих данных</button>

                    <form id="task-form"  action="javascript:void(null);" method="post">
                        <div><label for="editor1">Текст задачи</label></div>
                        <div><textarea id="editor1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="task_content"></textarea></div>
                        <div><label for="editor-a1">Вариант ответа 1</label></div>
                        <div><textarea id="editor-a1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer1"></textarea></div>
                        <div><label for="editor-a2">Вариант ответа 2</label></div>
                        <div><textarea id="editor-a2" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer2"></textarea></div>
                        <div><label for="editor-a3">Вариант ответа 3</label></div>
                        <div><textarea id="editor-a3" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer3"></textarea></div>
                        <div><label for="editor-a4">Вариант ответа 4</label></div>
                        <div><textarea id="editor-a4" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer4"></textarea></div>
                        <div><label for="editor-a5">Вариант ответа 5</label></div>
                        <div><textarea id="editor-a5" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer5"></textarea></div>
                        <div><label for="editor-a6">Вариант ответа 6</label></div>
                        <div><textarea id="editor-a6" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="answer6"></textarea></div>

                        <div><label for="editor-c1">Вариант для сопоставления 1</label><span>№ вопроса</span></div>
                        <div>
                            <select class="collate-to" size="1" name="collate-to1"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                            </select>
<!--                        <input type="text" class="form-input form-control collate-to" name="collate-to1" maxlength="4" size="2" value="">-->
                            <textarea id="editor-c1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="collate-answer1"></textarea>
                        </div>
                        <div><label for="editor-c2">Вариант для сопоставления 2</label></div>
                        <div>
                            <select class="collate-to" size="1" name="collate-to2"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                            </select>
                            <textarea id="editor-c2" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="collate-answer2"></textarea>
                        </div>
                        <div><label for="editor-c3">Вариант для сопоставления 3</label></div>
                        <div>
                            <select class="collate-to" size="1" name="collate-to3"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                            </select>
                            <textarea id="editor-c3" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="collate-answer3"></textarea>
                        </div>
                        <div><label for="editor-c4">Вариант для сопоставления 4</label></div>
                        <div>
                            <select class="collate-to" size="1" name="collate-to4"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                            </select>
                            <textarea id="editor-c4" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="collate-answer4"></textarea>
                        </div>
                        <div><label for="editor-c5">Вариант для сопоставления 5</label></div>
                        <div>
                            <select class="collate-to" size="1" name="collate-to5"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                            </select>
                            <textarea id="editor-c5" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="collate-answer5"></textarea>
                        </div>
                        <div><label for="editor-c6">Вариант для сопоставления 6</label></div>
                        <div>
                            <select class="collate-to" size="1" name="collate-to6"><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option>
                            </select>
                            <textarea id="editor-c6" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="collate-answer6"></textarea
                        </div>


                        <div class="list-form">
                            <div class="row">
                                <div class="col-xs-6 col-sm-5 col-xl-5"><label>Тип задачи</label></div>
                                <div class="col-xs-6 col-sm-7 col-xl-7"><input type="text" class="form-input form-control" name="type" maxlength="255"  value="задание"></div>
                            </div>

                            <div class="row">
                                <div class="col-xs-6 col-sm-5 col-xl-5"><label>Порядковый номер</label></div>
                                <div class="col-xs-6 col-sm-7 col-xl-7"><input type="text" class="form-input form-control" name="order_num" maxlength="10" size="6"></div>
                            </div>
                        </div>
                        <div style="display: none">
                            <input type="hidden" name="soundfile" maxlength="10" size="6" value="0">
                        </div>


                        <div class="answer-view">
                            <div class="row">
                                <div class="col-xs-6 col-sm-5 col-xl-5"><label>Отображение ответов</label></div>
                                <div class="col-xs-6 col-sm-7 col-xl-7">
                                    <select size="1" name="answers_view">
                                        <option selected value="default">Default</option>
                                        <option value="multiple">Множественный выбор</option>
                                        <option value="multiple-thin">Множ. выбор (узкие кнопки)</option>
                                        <option value="multiple-wide">Множ. выбор (длинные кнопки)</option>
                                        <option value="collate">Сопоставление ответов</option>
                                        <option value="img1">Картинки img1 - 6 шт</option>
                                        <option value="img2">Картинки img2 - 4 шт</option>
                                        <option value="input1">Input</option>
                                        <option value="sequence">Sequence</option>
                                        <option value="sequence-abv">Sequence АБВ</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="points-counting-method">
                            <div class="row">
                                <div class="col-xs-6 col-sm-5 col-xl-5"><label>Метод подсчета баллов</label></div>
                                <div class="col-xs-6 col-sm-7 col-xl-7">
                                    <select size="1" name="points_counting_method">
                                        <option value="default" selected>Default</option>
                                        <option value="point-per-error1">1 ошибка - балл</option>
                                        <option value="input-possibilities">несколько вариантов инпута</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="task-time">
                            <div><label>Время на выполнение задания</label></div>
                            <div class="form-group">
                                <label>Часов: <input type="text" class="form-input form-control" name="task_hours" maxlength="4" size="2" value=""></label>&nbsp;
                                <label>Минут: <input type="text" class="form-input form-control" name="task_minutes" maxlength="4" size="2" value=""></label>&nbsp;
                                <label>Секунд: <input type="text" class="form-input form-control" name="task_seconds" maxlength="4" size="2" value=""></label>
                            </div>
                        </div>
                        <div class="clear">&nbsp;</div>

                        <div><label>Баллы за ответы</label></div>
                        <div class="table-responsive points-table">
                            <table class="table table-bordered">
                                <thead>
                                <tr>
                                    <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><input type="text" class="form-input form-control" name="answer1_points" maxlength="10" size="4" value="0"></td>
                                    <td><input type="text" class="form-input form-control" name="answer2_points" maxlength="10" size="4" value="0"></td>
                                    <td><input type="text" class="form-input form-control" name="answer3_points" maxlength="10" size="4" value="0"></td>
                                    <td><input type="text" class="form-input form-control" name="answer4_points" maxlength="10" size="4" value="0"></td>
                                    <td><input type="text" class="form-input form-control" name="answer5_points" maxlength="10" size="4" value="0"></td>
                                    <td><input type="text" class="form-input form-control" name="answer6_points" maxlength="10" size="4" value="0"></td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <input type="hidden"  name="id" maxlength="10" size="6" value="">
                        <div class="response"></div>
                        <div class="submit">
                            <input value="Сохранить"  id="task-create" class="btn btn-success" type="submit"> <button class="delete btn btn-danger">Удалить</button>
                        </div>
                    </form>

                    </div>

                    <div class="current-file">Currently editing: <span></span></div>
                    <form id="test-general-form"  action="javascript:void(null);" method="post">
                        <div id="files-dir">
                            <!--<div class="browser">
                                <p id="pPathDisplay" class="pPathDisplay">Loading...</p>
                                <div id="dvContents" class="dvContents">&nbsp;</div>
                            </div>-->
                            <div id="file-tree">

                            </div>
                        </div>
                        <div id="start-message-editor">
                            <div><label for="editor-m1">Лендинг теста</label></div>
                            <div><textarea id="editor-m1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="start_message"></textarea></div>
                        </div>
                        <div class="task-description">
                            <div><label for="editor-d1">Описание теста</label></div>
                            <div><textarea id="editor-d1" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="description"></textarea></div>
                        </div>
                        <div class="task-description">
                            <div><label for="editor-d2">Описание теста при просмотре задания</label></div>
                            <div><textarea id="editor-d2" class="wm mce-content-body ontop writemaths tex2jax_ignore" rows="10" cols="60" name="in_task_description"></textarea></div>
                        </div>
                        <div class="test-title">
                            <label>Название теста: <input type="text" class="form-input form-control" name="test_title"  value=""></label>
                        </div>

                        <div class="test-time">
                            <div><label>Время на выполнение теста</label></div>
                            <div class="form-group">
                                <label>Часов: <input type="text" class="form-input form-control" name="test_hours" maxlength="4" size="2" value="0"></label>&nbsp;
                                <label>Минут: <input type="text" class="form-input form-control" name="test_minutes" maxlength="4" size="2" value="0"></label>&nbsp;
                                <label>Секунд: <input type="text" class="form-input form-control" name="test_seconds" maxlength="4" size="2" value="0"></label>
                            </div>
                        </div>
                        <div class="response"></div>
                        <div class="submit">
                            <input value="Сохранить" class="btn btn-success" id="test-general-save" type="submit">
                        </div>
                    </form>

                </div>
            </div>

    </div><!--row end-->

</div>

</body>
</html>