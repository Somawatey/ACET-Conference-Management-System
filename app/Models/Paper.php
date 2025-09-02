<?php

namespace App\Models;
use App\Models\User;
use App\Models\Topic;
use App\Models\Submission;
use App\Models\AuthorInfo;
use App\Models\Review;
use App\Models\Decision;
use App\Models\Conference;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;

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
        return $this->url ? asset('storage/' . ltrim($this->url, '/')) : null;
    }

    public function user(): HasOneThrough
    {
        return $this->hasOneThrough(
            User::class,
            Submission::class,
            'paper_id', // Foreign key on submissions table
            'id', // Foreign key on users table  
            'id', // Local key on papers table
            'user_id' // Local key on submissions table
        );
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

    public function assignments()
    {
        return $this->hasMany(PaperAssignment::class);
    }

    public function assignedReviewers()
    {
        return $this->belongsToMany(User::class, 'paper_assignments', 'paper_id', 'reviewer_id')
            ->withPivot('status', 'due_date')
            ->where('status', '!=', 'cancelled');
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
    
    public function getAuthorNameAttribute()
    {
        // Try to get author name from submission->authorInfo
        if ($this->submission && $this->submission->authorInfo) {
            return $this->submission->authorInfo->author_name;
        }
        // Fallback to author relationship if available
        if ($this->author) {
            return $this->author->name;
        }
        return null;
    }
}
