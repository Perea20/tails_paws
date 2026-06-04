<?php

namespace App\Mail;

use App\Models\Client; // 🌟 Importamos tu modelo Client
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewClientMail extends Mailable
{
    use Queueable, SerializesModels;

    public $client;
    public $activationUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(Client $client, string $activationUrl)
    {
       
        $this->client = $client;
        $this->activationUrl = $activationUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Bienvenido/a a Tails & Paws! Activa tu cuenta',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome-client', 
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}