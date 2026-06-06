<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\Auth\RegisterDTO;
use App\Models\User;
use App\Repositories\Interfaces\AuthRepositoryInterface;

final class UserRepository implements AuthRepositoryInterface
{
    public function findByEmail(string $email): ?User
    {
        return User::query()->where('email', $email)->first();
    }

    public function create(RegisterDTO $dto): User
    {
        return User::query()->create([
            'first_name' => $dto->firstName,
            'last_name' => $dto->lastName,
            'email' => $dto->email,
            'password' => $dto->password,
        ]);
    }
}
