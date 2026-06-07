<?php

namespace App\Models;

use Database\Factories\PostFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property int $user_id
 * @property string $body
 * @property boolean $is_private
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property \Carbon\CarbonImmutable|null $deleted_at
 *
 * @property MorphMany<Like, $this> $likes
 */

#[Fillable(['user_id', 'body', 'is_private'])]
class Post extends Model
{
    /** @use HasFactory<PostFactory> */
    use HasFactory, SoftDeletes;

    #[\Override]
    protected function casts(): array
    {
        return [
            'is_private' => 'boolean',
        ];
    }

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
}

