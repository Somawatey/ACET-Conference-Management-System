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
        'session_id',
        'title',
        'description',
        'type',
        'date',
        'start_time',
        'end_time',
        'location',
        'speaker',
        'order_index',
        'is_active'
    ];

    /**
     * Get the conference that owns the agenda item.
     */
    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class);
    }
    
    /**
     * Get the session that owns the agenda item.
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(ConferenceSession::class, 'session_id');
    }
}