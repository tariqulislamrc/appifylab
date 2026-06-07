<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;

test('post owner can delete their own post', function (): void {
    $user = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user, 'api')
        ->deleteJson("/api/v1/posts/{$post->id}")
        ->assertStatus(200);

    $this->assertSoftDeleted('posts', ['id' => $post->id]);
});

test('another user cannot delete someone elses post', function (): void {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $owner->id]);

    $this->actingAs($other, 'api')
        ->deleteJson("/api/v1/posts/{$post->id}")
        ->assertStatus(403);
});

test('unauthenticated request to delete post returns 401', function (): void {
    $post = Post::factory()->create();

    $this->deleteJson("/api/v1/posts/{$post->id}")
        ->assertStatus(401);
});
