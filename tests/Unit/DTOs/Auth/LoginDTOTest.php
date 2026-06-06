<?php

declare(strict_types=1);

use App\DTOs\Auth\LoginDTO;

test('fromArray hydrates email and password', function (): void {
    $dto = LoginDTO::fromArray([
        'email' => 'user@example.com',
        'password' => 'mypassword',
    ]);

    expect($dto->email)->toBe('user@example.com')
        ->and($dto->password)->toBe('mypassword');
});
