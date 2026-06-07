<?php

declare(strict_types=1);

use App\Models\User;

test('me returns the authenticated user resource', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user, 'api')
        ->getJson('/api/v1/auth/me')
        ->assertStatus(200)
        ->assertJsonPath('data.id', $user->id)
        ->assertJsonPath('data.email', $user->email)
        ->assertJsonStructure(['data' => ['id', 'first_name', 'last_name', 'email', 'avatar_url']]);
});

test('me returns 401 without a token', function (): void {
    $this->getJson('/api/v1/auth/me')
        ->assertStatus(401);
});
