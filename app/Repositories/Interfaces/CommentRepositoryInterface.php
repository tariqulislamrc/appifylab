<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\DTOs\CreateCommentDTO;
use App\Models\Comment;

interface CommentRepositoryInterface
{
    public function create(CreateCommentDTO $dto): Comment;

    public function findById(int $id): ?Comment;

    public function delete(Comment $comment): void;
}
