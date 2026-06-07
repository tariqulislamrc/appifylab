<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Post>
 */
final class PostFactory extends Factory
{
    /** @return array<string, mixed> */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'body' => fake()->paragraph(),
            'is_private' => fake()->boolean(),
        ];
    }

    public function public(): static
    {
        return $this->state(['is_private' => false]);
    }

    public function private(): static
    {
        return $this->state(['is_private' => true]);
    }
}
