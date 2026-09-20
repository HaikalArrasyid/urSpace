<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;

class GeneratePostmanCollection extends Command
{
    protected $signature = 'make:postman';
    protected $description = 'Generates a minimal structured Postman collection mapping all API routes.';

    public function handle()
    {
        $routes = Route::getRoutes()->getRoutesByMethod();
        $items = [];

        foreach (['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as $method) {
            if (!isset($routes[$method])) continue;

            foreach ($routes[$method] as $route) {
                if (!str_starts_with($route->uri(), 'api/') && $route->uri() !== '/' && $route->uri() !== 'health') {
                    continue;
                }

                $items[] = [
                    'name' => "[$method] /" . ltrim($route->uri(), '/'),
                    'request' => [
                        'method' => $method,
                        'header' => [
                            ['key' => 'Accept', 'value' => 'application/json']
                        ],
                        'url' => [
                            'raw' => '{{base_url}}/' . ltrim($route->uri(), '/'),
                            'host' => ['{{base_url}}'],
                            'path' => explode('/', ltrim($route->uri(), '/'))
                        ]
                    ]
                ];
            }
        }

        $collection = [
            'info' => [
                'name' => 'UKK Reserve API Contract',
                'schema' => 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
            ],
            'item' => $items,
            'variable' => [
                [
                    'key' => 'base_url',
                    'value' => 'http://localhost:8000',
                    'type' => 'string'
                ]
            ]
        ];

        $path = base_path('../docs/postman_collection.json');
        file_put_contents($path, json_encode($collection, JSON_PRETTY_PRINT));

        $this->info("Postman collection generated successfully at: $path");
    }
}
