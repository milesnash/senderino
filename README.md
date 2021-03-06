# senderino

### setup

```
$ docker-compose build
$ TWILIO_ACCOUNT_SID=<YOUR_TWILIO_ACCOUNT_SID> TWILIO_AUTH_TOKEN=<YOUR_TWILIO_AUTH_TOKEN> TWILIO_NUMBER=<YOUR_TWILIO_NUMBER> docker-compose up -d
```
Add BACKEND_ENV=prod to run the backend in prod mode
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console rabbitmq:setup-fabric
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console do:mi:mi
```

### running

1. Start message consumer
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console rabbitmq:consumer messaging
```

2. Start message status update tracker
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` bin/console app:update-msg-status
```

3. Compile frontend
```
$ docker exec -it `docker ps -q -f "name=senderino_backend"` npm run dev
```
Use `npm run build` to compile in prod mode

### access

* FRONTEND: `http://localhost`
* API DOCS: `http://localhost/api`
* RABBIT ADMIN: `http://localhost:8080`
