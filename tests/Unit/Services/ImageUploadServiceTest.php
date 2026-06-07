<?php

use App\Services\ImageUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('public');
    $this->service = new ImageUploadService;
});

test('store saves image and returns path', function (): void {
    $file = UploadedFile::fake()->image('photo.jpg');

    $path = $this->service->store($file);

    Storage::disk('public')->assertExists($path);
    expect($path)->toStartWith('posts/');
});

test('store rejects non-image mime type', function (): void {
    $file = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

    expect(fn () => $this->service->store($file))
        ->toThrow(InvalidArgumentException::class);
});

test('storeMany saves all files and returns paths', function (): void {
    $files = [
        UploadedFile::fake()->image('a.jpg'),
        UploadedFile::fake()->image('b.png'),
    ];

    $paths = $this->service->storeMany($files);

    expect($paths)->toHaveCount(2);
    foreach ($paths as $path) {
        Storage::disk('public')->assertExists($path);
    }
});
