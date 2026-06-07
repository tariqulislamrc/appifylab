<?php

namespace App\Http\Controllers;

use App\Actions\Like\ToggleLikeAction;
use App\Http\Resources\LikeResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use App\Repositories\Interfaces\LikeRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LikeController extends Controller
{
    public function togglePost(Post $post, ToggleLikeAction $action): JsonResponse
    {
        /** @var User $user */
        $user = auth('api')->user();

        $result = $action->execute($user, $post);

        return $this->toggleResponse($result);
    }

    public function toggleComment(Comment $comment, ToggleLikeAction $action): JsonResponse
    {
        /** @var User $user */
        $user = auth('api')->user();

        $result = $action->execute($user, $comment);

        return $this->toggleResponse($result);
    }

    public function postLikers(Post $post, LikeRepositoryInterface $likeRepository): AnonymousResourceCollection
    {
        $likes = $likeRepository->forLikeable($post);

        return LikeResource::collection($likes);
    }

    public function commentLikers(Comment $comment, LikeRepositoryInterface $likeRepository): AnonymousResourceCollection
    {
        $likes = $likeRepository->forLikeable($comment);

        return LikeResource::collection($likes);
    }

    /** @param array{liked: bool, likes_count: int} $result */
    private function toggleResponse(array $result): JsonResponse
    {
        $message = $result['liked'] ? 'Liked.' : 'Unliked.';

        return response()->json([
            'data' => $result,
            'message' => $message,
            'errors' => [],
        ]);
    }
}
