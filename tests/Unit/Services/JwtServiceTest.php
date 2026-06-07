<?php

declare(strict_types=1);

use App\Models\User;
use App\Services\JwtService;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

test('issueToken returns a non-empty string', function (): void {
    JWTAuth::shouldReceive('fromUser')
        ->once()
        ->andReturn('mocked.jwt.token');

    $service = new JwtService;
    $token = $service->issueToken(new User);

    expect($token)->toBe('mocked.jwt.token');
});

test('ttl returns configured jwt ttl as integer', function (): void {
    config(['jwt.ttl' => 120]);

    $service = new JwtService;

    expect($service->ttl())->toBe(120);
});

test('refresh returns a new token string', function (): void {
    $mockJwt = Mockery::mock();
    $mockJwt->shouldReceive('refresh')->once()->andReturn('new.jwt.token');

    JWTAuth::shouldReceive('parseToken')->once()->andReturn($mockJwt);

    $service = new JwtService;

    expect($service->refresh())->toBe('new.jwt.token');
});
