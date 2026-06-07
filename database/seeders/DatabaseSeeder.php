<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Known dev account — easy login during development
        $devUser = User::factory()->create([
            'first_name' => 'Dev',
            'last_name' => 'User',
            'email' => 'dev@example.com',
        ]);

        // 9 additional random users (10 total)
        $users = User::factory(9)->create();
        $users->push($devUser);

        // Each user gets 3–6 posts (mix of public/private)
        $users->each(function (User $user) use ($users): void {
            $posts = Post::factory(fake()->numberBetween(3, 6))
                ->for($user)
                ->create();

            $posts->each(function (Post $post) use ($users): void {
                // 0–4 comments per post from random users
                $comments = Comment::factory(fake()->numberBetween(0, 4))
                    ->for($post)
                    ->for($users->random(), 'user')
                    ->create();

                $comments->each(function (Comment $comment) use ($users): void {
                    // 0–3 replies per comment
                    Comment::factory(fake()->numberBetween(0, 3))
                        ->asReply($comment)
                        ->for($users->random(), 'user')
                        ->create();

                    // 0–5 users like each comment
                    $users->random(fake()->numberBetween(0, 5))
                        ->each(function (User $liker) use ($comment): void {
                            Like::firstOrCreate([
                                'user_id' => $liker->id,
                                'likeable_type' => Comment::class,
                                'likeable_id' => $comment->id,
                            ]);
                        });
                });

                // 0–8 users like each post
                $users->random(fake()->numberBetween(0, 8))
                    ->each(function (User $liker) use ($post): void {
                        Like::query()->firstOrCreate([
                            'user_id' => $liker->id,
                            'likeable_type' => Post::class,
                            'likeable_id' => $post->id,
                        ]);
                    });
            });
        });

        // Seed reply likes separately after all replies exist
        Comment::query()->whereNotNull('parent_id')->each(function (Comment $reply) use ($users): void {
            $users->random(fake()->numberBetween(0, 4))
                ->each(function (User $liker) use ($reply): void {
                    Like::query()->firstOrCreate([
                        'user_id' => $liker->id,
                        'likeable_type' => Comment::class,
                        'likeable_id' => $reply->id,
                    ]);
                });
        });
    }
}
