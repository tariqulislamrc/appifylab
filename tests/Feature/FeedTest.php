<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;

beforeEach(function (): void {
    $this->user = User::factory()->create();
});

test('feed returns public posts for any authenticated user', function (): void {
    Post::factory()->public()->count(3)->create();

    $this->actingAs($this->user, 'api')
        ->getJson('/api/v1/posts')
        ->assertStatus(200)
        ->assertJsonCount(3, 'data');
});

test('feed includes own private posts', function (): void {
    Post::factory()->private()->create(['user_id' => $this->user->id]);

    $this->actingAs($this->user, 'api')
        ->getJson('/api/v1/posts')
        ->assertStatus(200)
        ->assertJsonCount(1, 'data');
});

test('feed hides other users private posts', function (): void {
    $other = User::factory()->create();
    Post::factory()->private()->create(['user_id' => $other->id]);

    $this->actingAs($this->user, 'api')
        ->getJson('/api/v1/posts')
        ->assertStatus(200)
        ->assertJsonCount(0, 'data');
});

test('feed returns posts newest first', function (): void {
    $first = Post::factory()->public()->create(['created_at' => now()->subMinutes(10)]);
    $second = Post::factory()->public()->create(['created_at' => now()]);

    $ids = $this->actingAs($this->user, 'api')
        ->getJson('/api/v1/posts')
        ->assertStatus(200)
        ->json('data.*.id');

    expect($ids[0])->toBe($second->id)
        ->and($ids[1])->toBe($first->id);
});

test('feed is paginated with meta', function (): void {
    Post::factory()->public()->count(20)->create();

    $response = $this->actingAs($this->user, 'api')
        ->getJson('/api/v1/posts')
        ->assertStatus(200)
        ->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total']]);

    expect($response->json('meta.current_page'))->toBe(1);
});

test('feed returns 401 for unauthenticated request', function (): void {
    $this->getJson('/api/v1/posts')
        ->assertStatus(401);
});
