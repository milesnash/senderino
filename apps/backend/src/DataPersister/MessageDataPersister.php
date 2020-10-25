<?php

namespace App\DataPersister;

use ApiPlatform\Core\DataPersister\DataPersisterInterface;
use App\Entity\Message;
use App\RabbitMq\Producer\MessageProducer;
use Doctrine\ORM\EntityManagerInterface;
use Redis;
use Symfony\Component\Security\Core\Security;

class MessageDataPersister implements DataPersisterInterface
{
    private $entityManager;
    private $redis;
    private $security;

    public function __construct(
        EntityManagerInterface $entityManager,
        Security $security,
        Redis $redis,
        MessageProducer $producer
    ) {
        $this->entityManager = $entityManager;
        $this->producer = $producer;
        $this->redis = $redis;
        $this->security = $security;
    }

    public function supports($data): bool
    {
        return $data instanceof Message;
    }

    /**
     * @param Message $data
     */
    public function persist($data)
    {
        $user = $this->security->getUser();
        $data->setSender($user);

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        $this->redis->setEx('User-' . $user->getId(), 15, $data->getId());
        $this->producer->publish($data->getId());
    }

    public function remove($data)
    {
        $this->entityManager->remove($data);
        $this->entityManager->flush();
    }
}
