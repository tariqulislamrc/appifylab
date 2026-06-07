<?php

declare(strict_types=1);

use App\Models\Comment;
use App\Models\User;

test('user can like a comment and receives liked true', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/comments/{$comment->id}/likes")
        ->assertStatus(200)
        ->assertJsonPath('data.liked', true)
        ->assertJsonPath('data.likes_count', 1);
});

test('user can unlike a comment by toggling again', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();

    $this->actingAs($user, 'api')->postJson("/api/v1/comments/{$comment->id}/likes");

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/comments/{$comment->id}/likes")
        ->assertStatus(200)
        ->assertJsonPath('data.liked', false)
        ->assertJsonPath('data.likes_count', 0);
});

test('unauthenticated request to like a comment returns 401', function (): void {
    $comment = Comment::factory()->create();

    $this->postJson("/api/v1/comments/{$comment->id}/likes")
        ->assertStatus(401);
});
