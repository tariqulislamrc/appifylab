<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

final class JwtService
{
    public function issueToken(User $user): string
    {
        return (string) JWTAuth::fromUser($user);
    }

    public function invalidate(): void
    {
        auth('api')->logout();
    }

    /**
     * @throws JWTException
     */
    public function refresh(): string
    {
        return (string) JWTAuth::parseToken()->refresh();
    }

    public function ttl(): int
    {
        return (int) config('jwt.ttl');
    }
}
