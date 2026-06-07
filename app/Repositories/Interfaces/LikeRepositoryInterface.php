<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use App\Models\Like;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface LikeRepositoryInterface
{
    /** @return array{liked: bool, likes_count: int} */
    public function toggle(User $user, Model $likeable): array;

    /** @return Collection<int, Like> */
    public function forLikeable(Model $likeable): Collection;
}
