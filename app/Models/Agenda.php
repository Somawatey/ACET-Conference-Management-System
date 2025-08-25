<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Agenda extends Model
{
    use HasFactory;

    protected $fillable = [
        'conference_id',
        'title',
        'description',
        'type',
        'date',
        'start_time',
        'end_time',
        'location',
        'speaker',
        'order_index',
        'is_active',
        'session',
        'paper_id'
    ];

    /**
     * Get the conference that owns the agenda item.
     */
    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class);
    }
    public function paper(): BelongsTo
    {
        return $this->belongsTo(Paper::class);
    }
}