<?php

use App\Models\Comment;
use App\Models\User;

test('reply owner can delete their own reply', function (): void {
    $user = User::factory()->create();
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create(['user_id' => $user->id]);

    $this->actingAs($user, 'api')
        ->deleteJson("/api/v1/comments/{$reply->id}")
        ->assertStatus(200);

    $this->assertSoftDeleted('comments', ['id' => $reply->id]);
});

test('another user cannot delete someone elses reply', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create(['user_id' => $owner->id]);

    $this->actingAs($other, 'api')
        ->deleteJson("/api/v1/comments/{$reply->id}")
        ->assertStatus(403);
});

test('unauthenticated request to delete reply returns 401', function (): void {
    $comment = Comment::factory()->create();
    $reply = Comment::factory()->asReply($comment)->create();

    $this->deleteJson("/api/v1/comments/{$reply->id}")
        ->assertStatus(401);
});
