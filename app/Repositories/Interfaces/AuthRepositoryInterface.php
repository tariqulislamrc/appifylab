<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\DTOs\Auth\RegisterDTO;
use App\Models\User;

interface AuthRepositoryInterface
{
    public function findByEmail(string $email): ?User;

    public function create(RegisterDTO $dto): User;
}
