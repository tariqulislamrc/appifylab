<?php

declare(strict_types=1);

namespace App\Actions\Post;

use App\Models\Post;
use App\Models\User;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Auth\Access\AuthorizationException;

final readonly class DeletePostAction
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
    ) {}

    public function execute(Post $post, User $user): void
    {
        if ($post->user_id !== $user->id) {
            throw new AuthorizationException('You do not own this post.');
        }

        $this->postRepository->delete($post);
    }
}
