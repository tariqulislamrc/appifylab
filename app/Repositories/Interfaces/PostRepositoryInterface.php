<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\DTOs\CreatePostDTO;
use App\Models\Post;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

interface PostRepositoryInterface
{
    /**
     * @return LengthAwarePaginator<int, Post>
     */
    public function feed(User $user, int $perPage = 15): LengthAwarePaginator;

    public function findById(int $id): Post;

    public function create(CreatePostDTO $dto): Post;

    public function delete(Post $post): void;
}
