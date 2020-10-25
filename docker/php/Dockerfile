FROM php:7.4-fpm

LABEL name="senderino-backend"

RUN apt-get update && \
    apt-get install -y \
    libzip-dev

RUN docker-php-ext-install \
    bcmath \
    pdo_mysql \
    sockets \
    zip

RUN pecl install \
    apcu \
    redis && \
    docker-php-ext-enable \
    apcu \
    redis

WORKDIR /usr/src/app

COPY apps/backend /usr/src/app
COPY docker/php/senderino-php.ini /usr/local/etc/php/conf.d/

RUN PATH=$PATH:/usr/src/app/vendor/bin:bin

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV COMPOSER_HOME /tmp
ENV COMPOSER_VERSION 2.0.0

RUN set -eux; \
    curl --silent --fail --location --retry 3 --output /tmp/installer.php --url https://raw.githubusercontent.com/composer/getcomposer.org/cb19f2aa3aeaa2006c0cd69a7ef011eb31463067/web/installer; \
    php -r " \
    \$signature = '48e3236262b34d30969dca3c37281b3b4bbe3221bda826ac6a9a62d6444cdb0dcd0615698a5cbe587c3f0fe57a54d8f5'; \
    \$hash = hash('sha384', file_get_contents('/tmp/installer.php')); \
    if (!hash_equals(\$signature, \$hash)) { \
    unlink('/tmp/installer.php'); \
    echo 'Integrity check failed, installer is either corrupt or worse.' . PHP_EOL; \
    exit(1); \
    }"; \
    php /tmp/installer.php --no-ansi --install-dir=/usr/bin --filename=composer --version=${COMPOSER_VERSION}; \
    composer --ansi --version --no-interaction; \
    rm -f /tmp/installer.php;

RUN composer install --no-scripts --prefer-dist

# POST INSTALL
# php bin/console rabbitmq:setup-fabric
# php bin/console do:mi:mi
