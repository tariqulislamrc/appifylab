<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use InvalidArgumentException;
use RuntimeException;

final class ImageUploadService
{
    private const array ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    public function store(UploadedFile $file): string
    {
        if (! in_array($file->getMimeType(), self::ALLOWED_MIMES, strict: true)) {
            throw new InvalidArgumentException("Invalid image type: {$file->getMimeType()}");
        }

        $path = $file->store('posts', 'public');

        if ($path === false) {
            throw new RuntimeException('Failed to store uploaded image.');
        }

        return $path;
    }

    /**
     * @param  array<int, UploadedFile>  $files
     * @return array<int, string>
     */
    public function storeMany(array $files): array
    {
        return array_map($this->store(...), $files);
    }
}
