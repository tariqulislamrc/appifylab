<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Services\JwtService;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

final readonly class RefreshTokenAction
{
    public function __construct(
        private JwtService $jwtService,
    ) {}

    /**
     * @return array{token: string, ttl: int}
     *
     * @throws JWTException
     */
    public function execute(): array
    {
        return [
            'token' => $this->jwtService->refresh(),
            'ttl' => $this->jwtService->ttl(),
        ];
    }
}
