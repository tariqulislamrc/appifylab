<?php

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

test('likers list for a post returns users who liked it', function (): void {
    $owner = User::factory()->create();
    $liker = User::factory()->create();
    $post = Post::factory()->public()->create(['user_id' => $owner->id]);

    $this->actingAs($liker, 'api')->postJson("/api/v1/posts/{$post->id}/likes");

    $response = $this->actingAs($owner, 'api')
        ->getJson("/api/v1/posts/{$post->id}/likes")
        ->assertStatus(200);

    expect($response->json('data'))->toHaveCount(1)
        ->and($response->json('data.0.user.id'))->toBe($liker->id);
});

test('likers list for a comment returns users who liked it', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();

    $this->actingAs($user, 'api')->postJson("/api/v1/comments/{$comment->id}/likes");

    $response = $this->actingAs($user, 'api')
        ->getJson("/api/v1/comments/{$comment->id}/likes")
        ->assertStatus(200);

    expect($response->json('data'))->toHaveCount(1);
});

test('likers list for a reply returns users who liked it', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create();

    $this->actingAs($user, 'api')->postJson("/api/v1/comments/{$reply->id}/likes");

    $response = $this->actingAs($user, 'api')
        ->getJson("/api/v1/comments/{$reply->id}/likes")
        ->assertStatus(200);

    expect($response->json('data'))->toHaveCount(1);
});

test('likers list returns empty when no likes exist', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();

    $this->actingAs($user, 'api')
        ->getJson("/api/v1/posts/{$post->id}/likes")
        ->assertStatus(200)
        ->assertJsonCount(0, 'data');
});

test('unauthenticated request to get likers returns 401', function (): void {
    $post = Post::factory()->public()->create();

    $this->getJson("/api/v1/posts/{$post->id}/likes")
        ->assertStatus(401);
});
