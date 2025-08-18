<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $fillable = [
        'user_id',
        'paper_id',
        'author_info_id',
        'decision_id',
        'track',
        'submitted_elsewhere',
        'original_submission',
        'submitted_at',
    ];

    protected $casts = [
        'submitted_elsewhere' => 'boolean',
        'original_submission' => 'boolean',
        'submitted_at' => 'datetime',
    ];

    public function paper(): BelongsTo
    {
        return $this->belongsTo(Paper::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function authorInfo(): BelongsTo
    {
        return $this->belongsTo(AuthorInfo::class);
    }

    public function decision(): BelongsTo
    {
        return $this->belongsTo(Decision::class);
    }
}
