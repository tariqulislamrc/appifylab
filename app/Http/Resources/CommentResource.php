<?php

namespace App\Http\Resources;

use App\Models\Comment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /** @return array<string, mixed> */
    #[\Override]
    public function toArray(Request $request): array
    {
        /** @var Comment $comment */
        $comment = $this->resource;

        /** @var User|null $authUser */
        $authUser = auth('api')->user();

        return [
            'id' => $comment->id,
            'user' => new UserResource($comment->user),
            'body' => $comment->body,
            'likes_count' => $comment->likes_count ?? $comment->likes()->count(),
            'is_liked_by_me' => $authUser
                ? $comment->likes->contains('user_id', $authUser->id)
                : false,
            'replies_count' => $comment->replies_count ?? $comment->replies()->count(),
            'replies' => self::collection($comment->replies),
            'created_at' => $comment->created_at?->toISOString(),
        ];
    }
}
