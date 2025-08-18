<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaperReview extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'reviewer_id',
        'assignment_id',
        'technical_quality',
        'originality',
        'clarity',
        'relevance',
        'overall_recommendation',
        'comments',
        'submitted_at',
        'status',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'technical_quality' => 'integer',
        'originality' => 'integer',
        'clarity' => 'integer',
        'relevance' => 'integer',
        'overall_recommendation' => 'integer',
    ];

    public function paper(): BelongsTo
    {
        return $this->belongsTo(Paper::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(PaperAssignment::class);
    }
}
