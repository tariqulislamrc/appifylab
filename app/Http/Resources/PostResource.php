<?php

namespace App\Http\Resources;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    /** @return array<string, mixed> */
    #[\Override]
    public function toArray(Request $request): array
    {
        /** @var Post $post */
        $post = $this->resource;

        /** @var User|null $authUser */
        $authUser = auth('api')->user();

        return [
            'id' => $post->id,
            'user' => new UserResource($post->user),
            'body' => $post->body,
            'is_private' => $post->is_private,
            'images' => PostImageResource::collection($post->postImages),
            'likes_count' => $post->likes_count ?? $post->likes()->count(),
            'is_liked_by_me' => $authUser
                ? $post->likes->contains('user_id', $authUser->id)
                : false,
            'likers_preview' => $this->whenLoaded('likes', function () use ($post) {
                return $post->likes->take(3)->map(fn ($like) => [
                    'avatar_url' => $like->user?->avatar_url,
                ])->values();
            }, []),
            'comments_count' => $post->comments_count ?? $post->comments()->count(),
            'created_at' => $post->created_at?->toISOString(),
        ];
    }
}
