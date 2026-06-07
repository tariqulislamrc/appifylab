<?php

declare(strict_types=1);

namespace App\Actions\Like;

use App\Models\User;
use App\Repositories\Interfaces\LikeRepositoryInterface;
use Illuminate\Database\Eloquent\Model;

final readonly class ToggleLikeAction
{
    public function __construct(private LikeRepositoryInterface $likeRepository) {}

    /** @return array{liked: bool, likes_count: int} */
    public function execute(User $user, Model $likeable): array
    {
        return $this->likeRepository->toggle($user, $likeable);
    }
}
