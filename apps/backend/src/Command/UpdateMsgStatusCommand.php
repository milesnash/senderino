<?php

namespace App\Command;

use App\Entity\Message;
use App\Repository\MessageRepository;
use App\Service\MessageService;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class UpdateMsgStatusCommand extends Command
{
    protected static $defaultName = 'app:update-msg-status';

    private $messageRepository;
    private $messageService;

    public function __construct(
        MessageRepository $messageRepository,
        MessageService $messageService
    ) {
        parent::__construct();

        $this->messageRepository = $messageRepository;
        $this->messageService = $messageService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Update the status of messages in flight')
            ->addArgument('messageId', InputArgument::OPTIONAL, 'Just update one message regardless of status')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $messageId = $input->getArgument('messageId');

        if ($messageId) {
            $message = $this->messageRepository->find($messageId);
            $this->getSmsStatusAndUpdateMessage($message, $io);

            return 0;
        }

        $io->note('Monitoring messages for updates...');

        while (true) {
            $messages = $this->messageRepository->findByInFlightStatuses();

            foreach ($messages as $message) {
                $this->getSmsStatusAndUpdateMessage($message, $io);
            }

            sleep(10);
        }

        return 0;
    }

    private function getSmsStatusAndUpdateMessage(Message $message, SymfonyStyle $io)
    {
        $io->text(sprintf('Updating sent status of message: %s', $message->getId()));

        $status = $this->messageService->getSmsStatus($message);
        $message->setStatus($status);
        $this->messageRepository->save($message);

        $io->text('Message status updated to: ' . $status);
    }
}
