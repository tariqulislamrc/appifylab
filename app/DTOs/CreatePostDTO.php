<?php

namespace App\DTOs;

use Illuminate\Http\UploadedFile;

final readonly class CreatePostDTO
{
    /**
     * @param  array<int, UploadedFile>  $images
     */
    public function __construct(
        public int $userId,
        public ?string $body,
        public bool $isPrivate = false,
        public array $images = [],
    ) {}

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data, int $userId): self
    {
        return new self(
            userId: $userId,
            body: $data['body'] ?? null,
            isPrivate: (bool) ($data['is_private'] ?? false),
            images: $data['images'] ?? [],
        );
    }
}
