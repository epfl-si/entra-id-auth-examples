<?php
// Autoloader manuel pour OpenID Connect PHP et phpseclib
spl_autoload_register(function ($class) {
    $prefixes = [
        'Jumbojett\\' => __DIR__ . '/lib/openid-connect-php/src/',
        'phpseclib3\\' => __DIR__ . '/lib/phpseclib/', // Ajoutez le chemin vers phpseclib
    ];

    foreach ($prefixes as $prefix => $base_dir) {
        $len = strlen($prefix);
        if (strncmp($prefix, $class, $len) !== 0) {
            continue;
        }

        $relative_class = substr($class, $len);
        $file = $base_dir . str_replace('\\', '/', $relative_class) . '.php';

        if (file_exists($file)) {
            require $file;
            return;
        }
    }
});