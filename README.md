# senderino

### setup

```
$ docker-compose build
$ TWILIO_ACCOUNT_SID=<YOUR_TWILIO_ACCOUNT_SID> TWILIO_AUTH_TOKEN=<YOUR_TWILIO_AUTH_TOKEN> TWILIO_NUMBER=<YOUR_TWILIO_NUMBER> docker-compose up -d
```

### running

1. Setup Rabbit
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console rabbitmq:setup-fabric
```

2. Setup DB
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console do:mi:mi
```

3. Start message consumer
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console rabbitmq:consumer messaging
```

4. Start message status update tracker
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console app:update-msg-status
```

### access

* API DOCS: `http://localhost/api`
* RABBIT ADMIN: `http://localhost:8080`

### info

You can register through the API Platform test page (`http://localhost/api`) by posting a user.
You can then login at `http://localhost/login`. If you do so with a tool like Postman, you can then add the PHPSESSID cookie to devtools on the API Platform test page to be authorised to access the remaining test endpoints.
