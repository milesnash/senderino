<?php

namespace App\RabbitMq\Consumer;

use App\Repository\MessageRepository;
use App\Service\MessageService;
use OldSound\RabbitMqBundle\RabbitMq\ConsumerInterface;
use PhpAmqpLib\Message\AMQPMessage;

class MessageConsumer implements ConsumerInterface
{
    private $messageRepository;
    private $messageService;

    public function __construct(
        MessageRepository $messageRepository,
        MessageService $messageService
    ) {
        $this->messageRepository = $messageRepository;
        $this->messageService = $messageService;
    }
    public function execute(AMQPMessage $amqpMessage)
    {
        echo 'Retrieving message: ' . $amqpMessage->body . "\n";
        $message = $this->messageRepository->find($amqpMessage->body);

        echo 'Sending message: ' . $message->getId() . "\n";
        $response = $this->messageService->sendSms($message);

        echo 'Updating message status to "' . $response->status . "\"\n";
        $message->setStatus($response->status);
        $message->setStatusId($response->sid);
        $this->messageRepository->save($message);
    }
}
