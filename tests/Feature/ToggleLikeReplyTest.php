<?php

use App\Models\Comment;
use App\Models\User;

test('user can like a reply and receives liked true', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create();

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/comments/{$reply->id}/likes")
        ->assertStatus(200)
        ->assertJsonPath('data.liked', true)
        ->assertJsonPath('data.likes_count', 1);
});

test('user can unlike a reply by toggling again', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create();

    $this->actingAs($user, 'api')->postJson("/api/v1/comments/{$reply->id}/likes");

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/comments/{$reply->id}/likes")
        ->assertStatus(200)
        ->assertJsonPath('data.liked', false)
        ->assertJsonPath('data.likes_count', 0);
});

test('unauthenticated request to like a reply returns 401', function (): void {
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create();

    $this->postJson("/api/v1/comments/{$reply->id}/likes")
        ->assertStatus(401);
});
