<?php

return [
    'admin_credentials' => [
        'name'          => env('ADMIN_STAFF_NAME'),
        'lastname'      => env('ADMIN_STAFF_LASTNAME'),
        'email'         => env('ADMIN_STAFF_EMAIL'),
        'password'      => env('ADMIN_STAFF_PASSWORD'),
        'num_colegiado' => env('ADMIN_STAFF_NUM_COLEGIADO'),
    ],

    'reception_credentials' => [
        'name'          => env('RECEPTION_STAFF_NAME'),
        'lastname'      => env('RECEPTION_STAFF_LASTNAME'),
        'email'         => env('RECEPTION_STAFF_EMAIL'),
        'password'      => env('RECEPTION_STAFF_PASSWORD'),
        'num_colegiado' => env('RECEPTION_STAFF_NUM_COLEGIADO'),
    ],
];