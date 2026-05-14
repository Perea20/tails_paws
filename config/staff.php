<?php

return [
    'admin_credentials' => [
        'name'          => env('ADMIN_STAFF_NAME', 'Admin'),
        'lastname'      => env('ADMIN_STAFF_LASTNAME', 'Staff'),
        'email'         => env('ADMIN_STAFF_EMAIL'),
        'password'      => env('ADMIN_STAFF_PASSWORD'),
        'num_colegiado' => env('ADMIN_STAFF_NUM_COLEGIADO'),
    ],
];