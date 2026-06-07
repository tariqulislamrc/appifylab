<?php

declare(strict_types=1);

namespace App\Actions\Comment;

use App\DTOs\CreateCommentDTO;
use App\Models\Comment;
use App\Repositories\Interfaces\CommentRepositoryInterface;

final readonly class CreateCommentAction
{
    public function __construct(private readonly CommentRepositoryInterface $commentRepository) {}

    public function execute(CreateCommentDTO $dto): Comment
    {
        return $this->commentRepository->create($dto);
    }
}
