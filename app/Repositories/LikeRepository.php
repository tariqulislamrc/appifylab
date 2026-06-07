<?php

namespace App\Repositories;

use App\Models\Like;
use App\Models\User;
use App\Repositories\Interfaces\LikeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class LikeRepository implements LikeRepositoryInterface
{
    /** @return array{liked: bool, likes_count: int} */
    public function toggle(User $user, Model $likeable): array
    {
        $likeableType = $likeable->getMorphClass();
        $likeableId = $likeable->getKey();

        $existing = Like::query()->where([
            'user_id' => $user->id,
            'likeable_type' => $likeableType,
            'likeable_id' => $likeableId,
        ])->first();

        if ($existing !== null) {
            $existing->delete();
            $liked = false;
        } else {
            Like::query()->create([
                'user_id' => $user->id,
                'likeable_type' => $likeableType,
                'likeable_id' => $likeableId,
            ]);
            $liked = true;
        }

        $count = Like::query()->where([
            'likeable_type' => $likeableType,
            'likeable_id' => $likeableId,
        ])->count();

        return ['liked' => $liked, 'likes_count' => $count];
    }

    /** @return Collection<int, Like> */
    public function forLikeable(Model $likeable): Collection
    {
        return Like::query()->where([
            'likeable_type' => $likeable->getMorphClass(),
            'likeable_id' => $likeable->getKey(),
        ])->with('user')->get();
    }
}
