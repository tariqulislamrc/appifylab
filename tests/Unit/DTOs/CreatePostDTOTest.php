<?php

declare(strict_types=1);

use App\DTOs\CreatePostDTO;

test('fromArray hydrates all fields with defaults', function (): void {
    $dto = CreatePostDTO::fromArray([
        'body' => 'Hello world',
        'is_private' => true,
    ], userId: 42);

    expect($dto->userId)->toBe(42)
        ->and($dto->body)->toBe('Hello world')
        ->and($dto->isPrivate)->toBeTrue()
        ->and($dto->images)->toBe([]);
});

test('fromArray defaults to public (is_private false) when omitted', function (): void {
    $dto = CreatePostDTO::fromArray(['body' => 'Test'], userId: 1);

    expect($dto->isPrivate)->toBeFalse();
});

test('fromArray body is nullable', function (): void {
    $dto = CreatePostDTO::fromArray(['is_private' => false], userId: 1);

    expect($dto->body)->toBeNull();
});
