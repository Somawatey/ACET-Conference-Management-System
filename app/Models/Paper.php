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

    // Expose a computed public URL similar to User::profile_photo_url
    protected $appends = [
        'file_url',
    ];
    public function topic(): BelongsTo
    {
        return $this->belongsTo(Topic::class);
    }
    public function getFileUrlAttribute(): ?string
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

    public function authorInfo()
    {
        return $this->hasOneThrough(
            AuthorInfo::class,
            Submission::class,
            'paper_id', // Foreign key on submissions table
            'id', // Foreign key on author_infos table
            'id', // Local key on papers table
            'author_info_id' // Local key on submissions table
        );
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
