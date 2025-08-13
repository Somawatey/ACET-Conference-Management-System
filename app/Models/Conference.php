<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conference extends Model
{
    protected $fillable = [
        'conf_name',
        'topic',
        'date',
        'location'
    ];

    protected $casts = [
        'date' => 'date'
    ];

    public function papers(): HasMany
    {
        return $this->hasMany(Paper::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(ConferenceSession::class);
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