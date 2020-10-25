<?php

namespace App\Service;

use App\Entity\Message;
use Twilio\Rest\Client;

class MessageService
{
    private $twilioClient;
    private $twilioSender;

    public function __construct(
        Client $twilioClient,
        string $twilioSender
    ) {
        $this->twilioClient = $twilioClient;
        $this->twilioSender = '+' . $twilioSender;
    }

    public function sendSms(Message $message)
    {
        return $this->twilioClient->messages->create(
            '+' . $message->getRecipientPhoneNumber(),
            [
                'from' => $this->twilioSender,
                'body' => $message->getBody()
            ]
        );
    }

    public function getSmsStatus(Message $message)
    {
        $message = $this->twilioClient->messages($message->getStatusId())->fetch();

        return $message->status;
    }
}