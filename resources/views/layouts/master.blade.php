<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Stumble</title>
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
        <link rel="stylesheet" href="/css/app.css">

    </head>
    <body>
        <div id="app">
            <div class="p-3 shadow-sm mb-4" style="background-color: #e9ecef">
                <a class="d-flex justify-content-center text-decoration-none" href="/" style="color: black">
                    🍺
                    <h1>Stumble</h1>
                    🍺
                </a>
            </div>
            <router-view></router-view>
        </div>

        <script src="/js/app.js"></script>
    </body>
</html>
