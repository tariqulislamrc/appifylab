<?php

declare(strict_types=1);

namespace App\Repositories;

use App\DTOs\CreateCommentDTO;
use App\Models\Comment;
use App\Repositories\Interfaces\CommentRepositoryInterface;

final class CommentRepository implements CommentRepositoryInterface
{
    public function create(CreateCommentDTO $dto): Comment
    {
        /** @var Comment $comment */
        $comment = Comment::query()->create([
            'post_id' => $dto->postId,
            'user_id' => $dto->userId,
            'parent_id' => $dto->parentId,
            'body' => $dto->body,
        ]);

        $comment->load(['user', 'likes']);

        return $comment;
    }

    public function findById(int $id): ?Comment
    {
        return Comment::query()->find($id);
    }

    public function delete(Comment $comment): void
    {
        $comment->delete();
    }
}
