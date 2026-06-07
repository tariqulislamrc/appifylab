<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\CreatePostDTO;
use App\Models\Post;
use App\Models\User;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;

final class PostRepository implements PostRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<int, Post>
     */
    public function feed(User $user, int $perPage = 15): LengthAwarePaginator
    {
        return Post::query()
            ->visibleTo($user)
            ->with([
                'user',
                'postImages',
                'likes.user',
                'comments' => fn ($q) => $q->whereNull('parent_id')->withCount('likes')->with([
                    'user',
                    'likes.user',
                    'replies' => fn ($q) => $q->withCount('likes')->with([
                        'user',
                        'likes.user',
                    ]),
                ]),
            ])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate($perPage);
    }

    public function findById(int $id): Post
    {
        return Post::query()->findOrFail($id);
    }

    public function create(CreatePostDTO $dto): Post
    {
        return Post::query()->create([
            'user_id' => $dto->userId,
            'body' => $dto->body,
            'is_private' => $dto->isPrivate,
        ]);
    }

    public function delete(Post $post): void
    {
        $post->delete();
    }
}
