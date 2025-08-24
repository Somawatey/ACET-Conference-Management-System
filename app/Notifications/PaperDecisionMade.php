<?php

namespace App\Notifications;

use App\Models\Paper;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaperDecisionMade extends Notification
{
    use Queueable;
    // Properties to hold the data for our email
    protected $paper;
    protected $decision;
    protected $comment;

    /**
     * Create a new notification instance.
     * We'll pass the paper, decision, and comment when we create this notification.
     */
    public function __construct(Paper $paper, string $decision, string $comment)
    {
        $this->paper = $paper;
        $this->decision = $decision;
        $this->comment = $comment;
    }
  

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
         $subject = 'Decision Made on Your Paper Submission: "' . $this->paper->paper_title . '"';

        $mailMessage = (new MailMessage)
                    ->subject($subject)
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('A final decision has been made regarding your paper submission.')
                    ->line('**Paper Title:** ' . $this->paper->paper_title)
                    ->line('**Decision:** ' . $this->decision)
                    ->action('View Submission', url('/submissions/' . $this->paper->id)); // A button to view the paper

        // Only add the comment section if a comment was provided
        if (!empty($this->comment)) {
            $mailMessage->line('**Organizer\'s Comment:**')
                        ->line($this->comment);
        }

        $mailMessage->line('Thank you for your submission to our conference.');

        return $mailMessage;
    }
    

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
