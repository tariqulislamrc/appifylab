<?php

declare(strict_types=1);

use App\Models\Post;
use App\Models\User;
use App\Repositories\PostRepository;

beforeEach(function (): void {
    $this->repo = app(PostRepository::class);
    $this->user = User::factory()->create();
});

test('feed returns public posts visible to any user', function (): void {
    Post::factory()->public()->count(3)->create();

    $result = $this->repo->feed($this->user);

    expect($result->total())->toBe(3);
});

test('feed includes own private posts', function (): void {
    Post::factory()->private()->create(['user_id' => $this->user->id]);

    $result = $this->repo->feed($this->user);

    expect($result->total())->toBe(1);
});

test('feed excludes other users private posts', function (): void {
    $other = User::factory()->create();
    Post::factory()->private()->create(['user_id' => $other->id]);

    $result = $this->repo->feed($this->user);

    expect($result->total())->toBe(0);
});

test('feed returns posts in descending order by created_at', function (): void {
    $old = Post::factory()->public()->create(['created_at' => now()->subDay()]);
    $new = Post::factory()->public()->create(['created_at' => now()]);

    $ids = $this->repo->feed($this->user)->pluck('id')->toArray();

    expect($ids[0])->toBe($new->id)
        ->and($ids[1])->toBe($old->id);
});

test('feed paginates with the given per-page value', function (): void {
    Post::factory()->public()->count(10)->create();

    $page1 = $this->repo->feed($this->user, perPage: 4);

    expect($page1->perPage())->toBe(4)
        ->and($page1->lastPage())->toBe(3);
});
