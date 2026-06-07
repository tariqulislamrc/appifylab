<?php

declare(strict_types=1);

namespace App\Actions\Comment;

use App\Models\Comment;
use App\Repositories\Interfaces\CommentRepositoryInterface;

final readonly class DeleteCommentAction
{
    public function __construct(private readonly CommentRepositoryInterface $commentRepository) {}

    public function execute(Comment $comment): void
    {
        $this->commentRepository->delete($comment);
    }
}
