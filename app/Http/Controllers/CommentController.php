<?php

namespace App\Http\Controllers;

use App\Actions\Comment\CreateCommentAction;
use App\Actions\Comment\DeleteCommentAction;
use App\DTOs\CreateCommentDTO;
use App\Http\Requests\CreateCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index(Post $post): AnonymousResourceCollection
    {
        $comments = $post->comments()
            ->whereNull('parent_id')
            ->with(['user', 'likes', 'replies.user', 'replies.likes'])
            ->withCount(['likes', 'replies'])
            ->latest()
            ->paginate(20);

        return CommentResource::collection($comments);
    }

    public function store(
        CreateCommentRequest $request,
        Post $post,
        CreateCommentAction $action,
    ): JsonResponse {
        /** @var User $user */
        $user = auth('api')->user();

        $dto = CreateCommentDTO::fromArray($request->validated(), $user->id, $post->id);

        $comment = $action->execute($dto);

        return response()->json([
            'data' => new CommentResource($comment),
            'message' => 'Comment created.',
            'errors' => [],
        ], 201);
    }

    public function storeReply(
        CreateCommentRequest $request,
        Comment $comment,
        CreateCommentAction $action,
    ): JsonResponse {
        /** @var User $user */
        $user = auth('api')->user();

        $dto = CreateCommentDTO::fromArray($request->validated(), $user->id, $comment->post_id, $comment->id);

        $reply = $action->execute($dto);

        return response()->json([
            'data' => new CommentResource($reply),
            'message' => 'Reply created.',
            'errors' => [],
        ], 201);
    }

    public function destroy(
        Comment $comment,
        DeleteCommentAction $action,
    ): JsonResponse {
        Gate::authorize('delete', $comment);

        $action->execute($comment);

        return response()->json([
            'data' => null,
            'message' => 'Comment deleted.',
            'errors' => [],
        ]);
    }
}
