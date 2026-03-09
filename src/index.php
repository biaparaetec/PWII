<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <?php
        $nome = "José Silvas";
        $idade = 18;
        $salario = 3500.77;
        $casado = false;
        $habilitado = true;
        $cursos = ["php","bd", "front-end"];

         var_dump(
            $nome,
            $idade,
            $salario,
            $casado,
            $habilitado,
            $cursos
         );
         $cursos = 10;
         var_dump(
            $cursos
         )
    ?>
</body>
</html>