<?php

use App\Models\Post;
use App\Models\User;

test('user can like a post and receives liked true', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/posts/{$post->id}/likes")
        ->assertStatus(200)
        ->assertJsonPath('data.liked', true)
        ->assertJsonPath('data.likes_count', 1);
});

test('user can unlike a post by toggling again', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();

    $this->actingAs($user, 'api')->postJson("/api/v1/posts/{$post->id}/likes");

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/posts/{$post->id}/likes")
        ->assertStatus(200)
        ->assertJsonPath('data.liked', false)
        ->assertJsonPath('data.likes_count', 0);
});

test('unauthenticated request to like a post returns 401', function (): void {
    $post = Post::factory()->public()->create();

    $this->postJson("/api/v1/posts/{$post->id}/likes")
        ->assertStatus(401);
});
