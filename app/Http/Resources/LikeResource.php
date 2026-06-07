<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LikeResource extends JsonResource
{
    /** @return array<string, mixed> */
    #[\Override]
    public function toArray(Request $request): array
    {
        /** @var Like $like */
        $like = $this->resource;

        return [
            'id' => $like->id,
            'user' => new UserResource($like->user),
        ];
    }
}
