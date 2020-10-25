<?php

namespace App\Security\Voter;

use App\Entity\Message;
use Redis;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class MessagePostVoter extends Voter
{
    public function __construct(Redis $redis)
    {
        $this->redis = $redis;
    }

    protected function supports($attribute, $subject)
    {
        return $attribute === 'POST'
            && $subject instanceof Message;
    }

    protected function voteOnAttribute($attribute, $subject, TokenInterface $token)
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        if (!$this->redis->get('User-' . $user->getId())) {
            return true;
        }

        throw new TooManyRequestsHttpException(
            15, // TODO: Time remaining
            "You may only post a message once every 15 seconds."
        );
    }
}
