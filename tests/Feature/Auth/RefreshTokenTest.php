<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

test('authenticated user can refresh their token', function (): void {
    $user = User::factory()->create(['password' => Hash::make('password')]);
    $token = JWTAuth::fromUser($user);

    $this->withToken($token)
        ->postJson('/api/v1/auth/refresh')
        ->assertStatus(200)
        ->assertJsonStructure([
            'data' => ['token', 'token_type', 'expires_in'],
        ]);
});

test('refresh returns 401 without a token', function (): void {
    $this->postJson('/api/v1/auth/refresh')
        ->assertStatus(401);
});
