<?php

declare(strict_types=1);

use App\DTOs\Auth\RegisterDTO;

test('fromArray hydrates all fields correctly', function (): void {
    $dto = RegisterDTO::fromArray([
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane@example.com',
        'password' => 'secret123',
    ]);

    expect($dto->firstName)->toBe('Jane')
        ->and($dto->lastName)->toBe('Doe')
        ->and($dto->email)->toBe('jane@example.com')
        ->and($dto->password)->toBe('secret123');
});
