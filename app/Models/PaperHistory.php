<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',         // ID of the user who uploaded the paper
        'paper_title',     // Title of the paper
        'paper_abstract',  // Abstract of the paper
        'paper_file',      // File path or name of the uploaded paper
        'decision_comment' // Comment from the decision/review
    ];

    

    // Relationships (optional)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}