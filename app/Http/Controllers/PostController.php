<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\Post\CreatePostAction;
use App\Actions\Post\DeletePostAction;
use App\DTOs\CreatePostDTO;
use App\Http\Requests\CreatePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use App\Models\User;
use App\Repositories\Interfaces\PostRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

final class PostController extends Controller
{
    public function index(PostRepositoryInterface $postRepository): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = auth('api')->user();

        $posts = $postRepository->feed($user);

        return PostResource::collection($posts);
    }

    public function store(
        CreatePostRequest $request,
        CreatePostAction $action,
    ): JsonResponse {
        /** @var User $user */
        $user = auth('api')->user();

        $data = array_merge(
            $request->validated(),
            ['images' => $request->file('images') ?? []],
        );

        $post = $action->execute(CreatePostDTO::fromArray($data, $user->id));

        return response()->json([
            'data' => new PostResource($post),
            'message' => 'Post created.',
            'errors' => [],
        ], 201);
    }

    public function destroy(
        Post $post,
        DeletePostAction $action,
    ): JsonResponse {
        /** @var User $user */
        $user = auth('api')->user();

        Gate::authorize('delete', $post);

        $action->execute($post, $user);

        return response()->json([
            'data' => null,
            'message' => 'Post deleted.',
            'errors' => [],
        ]);
    }
}
