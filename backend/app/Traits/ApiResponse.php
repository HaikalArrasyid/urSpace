<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Return a standardized success response.
     */
    protected function successResponse(string $message, $data = [], int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'statusCode' => $statusCode,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString()
        ], $statusCode);
    }

    /**
     * Return a standardized error response.
     */
    protected function errorResponse(string $message, string $errorLabel, int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'status' => false,
            'statusCode' => $statusCode,
            'message' => $message,
            'error' => $errorLabel,
            'timestamp' => now()->toISOString()
        ], $statusCode);
    }
}
