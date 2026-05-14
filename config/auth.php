<?php

use App\Models\Client; 
use App\Models\Staff; 

return [

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'clients'),
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'clients',
        ],

        'staff' => [
        'driver' => 'session',
        'provider' => 'staff_provider', // Nombre del proveedor que crearemos abajo
        ],
    ],

    'providers' => [
        'clients' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', Client::class), 
        ],
        'staff_provider' => [
        'driver' => 'eloquent',
        'model' => Staff::class, 
    ],
    ],

    'passwords' => [
        'clients' => [
            'provider' => 'clients',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];