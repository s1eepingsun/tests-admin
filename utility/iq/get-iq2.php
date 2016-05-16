<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Конвертация iq</title>
    <script src="../../js/libs/jquery-1.11.3.min.js"></script>
    <script src="../../js/libs/underscore-min.js"></script>
    <?php
    $test = file_get_contents('./iq-ege-4.json');
    ?>
    <script>
        var test = <?=$test?>;
    </script>
    <script src="get-iq.js"></script>
</head>
<body>

</body>
</html>