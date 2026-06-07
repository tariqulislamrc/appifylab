<?php

declare(strict_types=1);

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

test('authenticated user can comment on a public post', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/posts/{$post->id}/comments", ['body' => 'Great post!'])
        ->assertStatus(201)
        ->assertJsonPath('data.body', 'Great post!')
        ->assertJsonStructure(['data' => ['id', 'body', 'user', 'likes_count', 'created_at']]);

    $this->assertDatabaseHas('comments', ['post_id' => $post->id, 'user_id' => $user->id, 'body' => 'Great post!']);
});

test('unauthenticated request to create comment returns 401', function (): void {
    $post = Post::factory()->public()->create();

    $this->postJson("/api/v1/posts/{$post->id}/comments", ['body' => 'Hello'])
        ->assertStatus(401);
});

test('comment body is required', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/posts/{$post->id}/comments", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['body']);
});

test('can fetch comments for a post', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();
    Comment::factory()->count(3)->create(['post_id' => $post->id]);

    $this->actingAs($user, 'api')
        ->getJson("/api/v1/posts/{$post->id}/comments")
        ->assertStatus(200)
        ->assertJsonCount(3, 'data');
});
