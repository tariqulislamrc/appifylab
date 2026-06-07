<?php

use App\Models\Post;
use App\Models\User;
use App\Repositories\LikeRepository;

beforeEach(function (): void {
    $this->repo = app(LikeRepository::class);
    $this->user = User::factory()->create();
    $this->post = Post::factory()->public()->create();
});

test('toggle creates a like on first call', function (): void {
    $result = $this->repo->toggle($this->user, $this->post);

    expect($result['liked'])->toBeTrue()
        ->and($result['likes_count'])->toBe(1);
});

test('toggle removes the like on second call', function (): void {
    $this->repo->toggle($this->user, $this->post);
    $result = $this->repo->toggle($this->user, $this->post);

    expect($result['liked'])->toBeFalse()
        ->and($result['likes_count'])->toBe(0);
});

test('double-like results in exactly one like record', function (): void {
    $this->repo->toggle($this->user, $this->post);
    $this->repo->toggle($this->user, $this->post);
    $result = $this->repo->toggle($this->user, $this->post);

    expect($result['liked'])->toBeTrue()
        ->and($result['likes_count'])->toBe(1);

    $this->assertDatabaseCount('likes', 1);
});

test('forLikeable returns all likes for a model', function (): void {
    $other = User::factory()->create();

    $this->repo->toggle($this->user, $this->post);
    $this->repo->toggle($other, $this->post);

    $likes = $this->repo->forLikeable($this->post);

    expect($likes)->toHaveCount(2);
});

test('likes from different users are independent', function (): void {
    $other = User::factory()->create();
    $post2 = Post::factory()->public()->create();

    $this->repo->toggle($this->user, $this->post);
    $result = $this->repo->toggle($other, $post2);

    expect($result['liked'])->toBeTrue()
        ->and($this->repo->forLikeable($this->post))->toHaveCount(1)
        ->and($this->repo->forLikeable($post2))->toHaveCount(1);
});
