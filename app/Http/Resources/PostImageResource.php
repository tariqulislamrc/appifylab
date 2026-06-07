<?php

declare(strict_types=1);

namespace App\Http\Resources;

use App\Models\PostImage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostImageResource extends JsonResource
{
    /** @return array<string, mixed> */
    #[\Override]
    public function toArray(Request $request): array
    {
        /** @var PostImage $image */
        $image = $this->resource;

        return [
            'id' => $image->id,
            'url' => asset('storage/'.$image->path),
        ];
    }
}
