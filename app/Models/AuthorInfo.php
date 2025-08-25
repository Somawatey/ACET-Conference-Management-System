<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class AuthorInfo extends Model
{
    protected $fillable = [
        'author_name',
        'author_email',
        'institute',
        'correspond_name',
        'correspond_email',
        'coauthors',
    ];

    public function Paper(): HasOne
    {
        return $this->hasOne(Paper::class);
    }
}
