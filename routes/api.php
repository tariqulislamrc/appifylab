<?php

declare(strict_types=1);

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReplyController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:auth');
        Route::post('register', [AuthController::class, 'register'])->middleware('throttle:auth');

        Route::middleware('auth:api')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::get('me', [AuthController::class, 'me']);
        });
    });

    Route::middleware('auth:api')->group(function () {
        Route::get('posts', [PostController::class, 'index']);
        Route::post('posts', [PostController::class, 'store']);
        Route::delete('posts/{post}', [PostController::class, 'destroy']);

        // Comments
        Route::get('posts/{post}/comments', [CommentController::class, 'index']);
        Route::post('posts/{post}/comments', [CommentController::class, 'store']);
        Route::post('comments/{comment}/replies', [CommentController::class, 'storeReply']);
        Route::delete('comments/{comment}', [CommentController::class, 'destroy']);

        // Likes — toggle
        Route::post('posts/{post}/likes', [LikeController::class, 'togglePost']);
        Route::post('comments/{comment}/likes', [LikeController::class, 'toggleComment']);

        // Likes — likers list
        Route::get('posts/{post}/likes', [LikeController::class, 'postLikers']);
        Route::get('comments/{comment}/likes', [LikeController::class, 'commentLikers']);
    });

});
