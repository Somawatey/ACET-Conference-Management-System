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
        'paper_id',
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
        'session'
    ];

    protected $attributes = [
        'is_active' => true,
        'order_index' => 0,
        'paper_id' => null,
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