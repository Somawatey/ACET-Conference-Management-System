<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Paper extends Model
{
    protected $fillable = [
        'paper_title',
        'url',
        'topic',
        'keyword',
        'abstract',
        'user_id',
        'conference_id',
        'status'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function decision(): HasOne
    {
        return $this->hasOne(Decision::class);
    }

    public function submission(): HasOne
    {
        return $this->hasOne(Submission::class);
    }

    public function session(): HasOne
    {
        return $this->hasOne(ConferenceSession::class);
    }
}