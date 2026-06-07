<?php

declare(strict_types=1);

namespace App\Models;

use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Override;

/**
 * @property int $id
 * @property int $user_id
 * @property string $body
 * @property bool $is_private
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property \Carbon\CarbonImmutable|null $deleted_at
 * @property Collection<int, Like> $likes
 */
#[Fillable(['user_id', 'body', 'is_private'])]
final class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory, SoftDeletes;

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return HasMany<PostImage, $this> */
    public function postImages(): HasMany
    {
        return $this->hasMany(PostImage::class);
    }

    /** @return HasMany<Comment, $this> */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /** @return MorphMany<Like, $this> */
    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    /**
     * @param  Builder<Post>  $query
     */
    public function scopePublic(Builder $query): void
    {
        $query->where('is_private', false);
    }

    /**
     * Posts visible to the given user:
     * all public posts + the user's own private posts.
     *
     * @param  Builder<Post>  $query
     */
    public function scopeVisibleTo(Builder $query, User $user): void
    {
        $query->where(function (Builder $q) use ($user): void {
            $q->where('is_private', false)
                ->orWhere(function (Builder $q) use ($user): void {
                    $q->where('is_private', true)
                        ->where('user_id', $user->id);
                });
        });
    }

    #[Override]
    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
        ];
    }
}
