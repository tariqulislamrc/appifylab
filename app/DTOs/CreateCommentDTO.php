<?php

declare(strict_types=1);

namespace App\DTOs;

final readonly class CreateCommentDTO
{
    public function __construct(
        public int $postId,
        public int $userId,
        public string $body,
        public ?int $parentId = null,
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data, int $userId, int $postId, ?int $parentId = null): self
    {
        return new self(
            postId: $postId,
            userId: $userId,
            body: (string) $data['body'],
            parentId: $parentId,
        );
    }
}
