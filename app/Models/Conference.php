<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conference extends Model
{
    protected $fillable = [
        'conf_name',
        'topic',
        'start_date',
        'end_date',
        'location'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date'
    ];

    // Add this accessor to format date for forms
    public function getDateAttribute($value)
    {
        return $value ? \Carbon\Carbon::parse($value)->format('Y-m-d') : null;
    }

    public function papers(): HasMany
    {
        return $this->hasMany(Paper::class);
    }

    public function agendas(): HasMany
    {
        return $this->hasMany(Agenda::class);
    }

    public function acceptedPapers(): HasMany
    {
        return $this->papers()->where('status', 'accepted');
    }
}