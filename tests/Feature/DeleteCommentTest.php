<?php

declare(strict_types=1);

use App\Models\Comment;
use App\Models\Post;
use App\Models\User;

test('comment owner can delete their own comment', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->public()->create();
    $comment = Comment::factory()->create(['post_id' => $post->id, 'user_id' => $user->id]);

    $this->actingAs($user, 'api')
        ->deleteJson("/api/v1/comments/{$comment->id}")
        ->assertStatus(200);

    $this->assertSoftDeleted('comments', ['id' => $comment->id]);
});

test('another user cannot delete someone elses comment', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $post = Post::factory()->public()->create();
    $comment = Comment::factory()->create(['post_id' => $post->id, 'user_id' => $owner->id]);

    $this->actingAs($other, 'api')
        ->deleteJson("/api/v1/comments/{$comment->id}")
        ->assertStatus(403);
});

test('unauthenticated request to delete comment returns 401', function (): void {
    $comment = Comment::factory()->create();

    $this->deleteJson("/api/v1/comments/{$comment->id}")
        ->assertStatus(401);
});
