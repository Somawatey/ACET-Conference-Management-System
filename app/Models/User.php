<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_photo_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected $appends = [
        'profile_photo_url',
    ];
    public function getProfilePhotoUrlAttribute()
    {
        return $this->profile_photo_path 
            ? asset('storage/' . $this->profile_photo_path)
            : null;
    }


    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
    public function papers(): HasMany
    {
        return $this->hasMany(Paper::class, 'author_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function decisions(): HasMany
    {
        return $this->hasMany(Decision::class, 'organizer_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function paperAssignments(): HasMany
    {
        return $this->hasMany(PaperAssignment::class, 'reviewer_id');
    }

    

   
}
