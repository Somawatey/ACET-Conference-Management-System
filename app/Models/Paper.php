<?php

namespace App\Models;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Paper extends Model
{
    protected $fillable = [
        'paper_title',
        'url',
        'topic',
        'keyword',
        'abstract',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function submission(): HasOne
    {
        return $this->hasOne(Submission::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function decision(): HasOne
    {
        return $this->hasOne(Decision::class);
    }

    public function session(): HasOne
    {
        return $this->hasOne(ConferenceSession::class);
    }
    
    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class);
    }
    
    public function getPdfUrlAttribute()
    {
        return $this->url ? asset('storage/' . ltrim($this->url, '/')) : null;
    }
}
