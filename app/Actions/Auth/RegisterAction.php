<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\DTOs\Auth\RegisterDTO;
use App\Repositories\Interfaces\AuthRepositoryInterface;
use App\Services\JwtService;

final readonly class RegisterAction
{
    public function __construct(
        private AuthRepositoryInterface $authRepository,
        private JwtService $jwtService,
    ) {}

    /** @return array{token: string, token_type: string, expires_in: int} */
    public function execute(RegisterDTO $dto): array
    {
        $user = $this->authRepository->create($dto);

        return [
            'token' => $this->jwtService->issueToken($user),
            'token_type' => 'bearer',
            'expires_in' => $this->jwtService->ttl(),
            'user' => $user,
        ];
    }
}
