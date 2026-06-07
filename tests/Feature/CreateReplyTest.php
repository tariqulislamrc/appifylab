<?php

declare(strict_types=1);

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

test('authenticated user can reply to a comment', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();
    $comment = Comment::factory()->create(['post_id' => $post->id]);

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/comments/{$comment->id}/replies", ['body' => 'Nice comment!'])
        ->assertStatus(201)
        ->assertJsonPath('data.body', 'Nice comment!')
        ->assertJsonStructure(['data' => ['id', 'body', 'user', 'likes_count', 'created_at']]);

    $this->assertDatabaseHas('comments', ['parent_id' => $comment->id, 'user_id' => $user->id]);
});

test('unauthenticated request to create reply returns 401', function (): void {
    $comment = Comment::factory()->create();

    $this->postJson("/api/v1/comments/{$comment->id}/replies", ['body' => 'Hello'])
        ->assertStatus(401);
});

test('reply body is required', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();

    $this->actingAs($user, 'api')
        ->postJson("/api/v1/comments/{$comment->id}/replies", [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['body']);
});
