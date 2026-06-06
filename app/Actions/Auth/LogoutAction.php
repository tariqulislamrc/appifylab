<?php

declare(strict_types=1);

namespace App\Actions\Auth;

use App\Services\JwtService;

final readonly class LogoutAction
{
    public function __construct(
        private JwtService $jwtService,
    ) {}

    public function execute(): void
    {
        $this->jwtService->invalidate();
    }
}
