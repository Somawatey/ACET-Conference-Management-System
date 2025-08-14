<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Paper extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'abstract',
        'file_path',
        'status',
        'author_id',
        'category_id',
        'submission_date',
        'review_deadline',
    ];

    protected $casts = [
        'submission_date' => 'datetime',
        'review_deadline' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(PaperAssignment::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(PaperReview::class);
    }
}
