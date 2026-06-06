<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\DTOs\Auth\LoginDTO;
use App\Services\JwtService;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

final readonly class LoginAction
{
    public function __construct(
        private JwtService $jwtService,
    ) {}

    /**
     * @return array{token: string, token_type: string, expires_in: int}|null
     *                                                                        Returns null when credentials are invalid.
     */
    public function execute(LoginDTO $dto): ?array
    {
        try {
            $token = auth('api')->attempt([
                'email' => $dto->email,
                'password' => $dto->password,
            ]);
        } catch (JWTException) {
            return null;
        }

        if (! $token) {
            return null;
        }

        return [
            'token' => (string) $token,
            'token_type' => 'bearer',
            'expires_in' => $this->jwtService->ttl(),
            'user' => auth('api')->user(),
        ];
    }
}
