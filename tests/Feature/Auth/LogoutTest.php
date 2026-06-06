<?php

use App\Models\User;

test('authenticated user can log out successfully', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user, 'api')
        ->postJson('/api/v1/auth/logout')
        ->assertStatus(200)
        ->assertJson(['data' => null]);
});

test('logout returns 401 without a token', function (): void {
    $this->postJson('/api/v1/auth/logout')
        ->assertStatus(401);
});
