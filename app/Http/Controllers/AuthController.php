<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Auth\LoginAction;
use App\Actions\Auth\LogoutAction;
use App\Actions\Auth\RefreshTokenAction;
use App\Actions\Auth\RegisterAction;
use App\DTOs\Auth\LoginDTO;
use App\DTOs\Auth\RegisterDTO;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\AuthResource;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

final class AuthController extends Controller
{
    public function register(
        RegisterRequest $request,
        RegisterAction $action,
    ): JsonResponse {
        $result = $action->execute(RegisterDTO::fromArray($request->validated()));

        return response()->json([
            'data' => new AuthResource($result),
            'message' => 'Registration successful.',
            'errors' => [],
        ], 201);
    }

    public function login(
        LoginRequest $request,
        LoginAction $action,
    ): JsonResponse {

        $result = $action->execute(LoginDTO::fromArray($request->validated()));

        if ($result === null) {
            return response()->json([
                'data' => null,
                'message' => 'Invalid credentials.',
                'errors' => ['credentials' => 'These credentials do not match our records.'],
            ], 422);
        }

        return response()->json([
            'data' => new AuthResource($result),
            'message' => 'Login successful.',
            'errors' => [],
        ]);
    }

    public function logout(LogoutAction $action): JsonResponse
    {
        $action->execute();

        return response()->json([
            'data' => null,
            'message' => 'Logged out successfully.',
            'errors' => [],
        ]);
    }

    /**
     * @throws JWTException
     */
    public function refresh(RefreshTokenAction $action): JsonResponse
    {
        $result = $action->execute();

        return response()->json([
            'data' => [
                'token' => $result['token'],
                'token_type' => 'bearer',
                'expires_in' => $result['ttl'],
            ],
            'message' => 'Token refreshed.',
            'errors' => [],
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'data' => new UserResource(auth('api')->user()),
            'message' => 'Authenticated user.',
            'errors' => [],
        ]);
    }
}
