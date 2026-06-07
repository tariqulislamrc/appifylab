<?php

declare(strict_types=1);

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('public');
    $this->user = User::factory()->create();
});

test('authenticated user can create a text-only post', function (): void {
    $response = $this->actingAs($this->user, 'api')
        ->postJson('/api/v1/posts', [
            'body' => 'Hello world!',
            'is_private' => false,
        ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.body', 'Hello world!')
        ->assertJsonPath('data.is_private', false)
        ->assertJsonStructure(['data' => ['id', 'body', 'is_private', 'likes_count', 'comments_count', 'user']]);

    $this->assertDatabaseHas('posts', ['body' => 'Hello world!', 'user_id' => $this->user->id]);
});

test('authenticated user can create a post with an image', function (): void {
    $image = UploadedFile::fake()->image('photo.jpg');

    $response = $this->actingAs($this->user, 'api')
        ->post('/api/v1/posts', [
            'body' => 'With image',
            'is_private' => '0',
            'images' => [$image],
        ]);

    $response->assertStatus(201)
        ->assertJsonCount(1, 'data.images');

    Storage::disk('public')->assertExists($response->json('data.images.0.url') ? mb_ltrim(parse_url((string) $response->json('data.images.0.url'), PHP_URL_PATH), '/storage/') : '');
});

test('authenticated user can create a private post', function (): void {
    $this->actingAs($this->user, 'api')
        ->postJson('/api/v1/posts', [
            'body' => 'Secret post',
            'is_private' => true,
        ])
        ->assertStatus(201)
        ->assertJsonPath('data.is_private', true);
});

test('unauthenticated request to create post returns 401', function (): void {
    $this->postJson('/api/v1/posts', ['body' => 'Test'])
        ->assertStatus(401);
});

test('post creation fails with invalid is_private value', function (): void {
    $this->actingAs($this->user, 'api')
        ->postJson('/api/v1/posts', [
            'body' => 'Test',
            'is_private' => 'not-a-boolean',
        ])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['is_private']);
});
