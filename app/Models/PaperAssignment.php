<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaperAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'paper_id',
        'reviewer_id',
        'assigned_by',
        'due_date',
        'status',
        'notes'
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    /**
     * Get the paper that is assigned
     */
    public function paper()
    {
        return $this->belongsTo(Paper::class);
    }

    /**
     * Get the reviewer assigned to the paper
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Get the user who assigned the paper
     */
    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }
}