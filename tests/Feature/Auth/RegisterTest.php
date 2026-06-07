<?php

declare(strict_types=1);

use App\Models\User;

test('user can register with valid data and receives a token', function (): void {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'data' => ['user' => ['id', 'first_name', 'last_name', 'email'], 'token', 'token_type', 'expires_in'],
        ]);

    $this->assertDatabaseHas('users', ['email' => 'jane@example.com']);
});

test('registration fails with duplicate email', function (): void {
    User::factory()->create(['email' => 'taken@example.com']);

    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Bob',
        'last_name' => 'Smith',
        'email' => 'taken@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('registration fails when required fields are missing', function (): void {
    $response = $this->postJson('/api/v1/auth/register', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'password']);
});

test('registration fails with password shorter than 8 characters', function (): void {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});

test('registration fails when passwords do not match', function (): void {
    $response = $this->postJson('/api/v1/auth/register', [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane@example.com',
        'password' => 'password123',
        'password_confirmation' => 'different456',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['password']);
});
