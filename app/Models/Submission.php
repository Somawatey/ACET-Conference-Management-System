<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'paper_id',
        'author_info_id',
        'track',
        'submitted_elsewhere',
        'original_submission',
        'submitted_at',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function paper(): BelongsTo
    {
        return $this->belongsTo(Paper::class);
    }

    public function authorInfo(): BelongsTo
    {
        return $this->belongsTo(AuthorInfo::class);
    }

    // Decision is associated to Paper via paper_id; access via $this->paper->decision
}
