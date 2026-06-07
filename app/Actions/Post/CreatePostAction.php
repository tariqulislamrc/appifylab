<?php

namespace App\Actions\Post;

use App\DTOs\CreatePostDTO;
use App\Models\Post;
use App\Models\PostImage;
use App\Repositories\Interfaces\PostRepositoryInterface;
use App\Services\ImageUploadService;

final readonly class CreatePostAction
{
    public function __construct(
        private PostRepositoryInterface $postRepository,
        private ImageUploadService      $imageUploadService,
    ) {}

    public function execute(CreatePostDTO $dto): Post
    {
        $post = $this->postRepository->create($dto);

        if ($dto->images !== []) {
            $paths = $this->imageUploadService->storeMany($dto->images);

            foreach ($paths as $path) {
                PostImage::create(['post_id' => $post->id, 'path' => $path]);
            }
        }

        $post->load(['user', 'postImages', 'likes.user', 'comments']);
        $post->loadCount(['likes', 'comments']);

        return $post;
    }
}
