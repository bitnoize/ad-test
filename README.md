Ad-Test
=======

Тестовое задание на позицию TypeScript Backend разработчика.

Постановка задачи
-----------------

Создать сервис с двумя роутами: /auth и /balance, используя Node.js и Express.js.
Сервис должен выполнять авторизацию на сайте https://trending.bid через /auth и затем
получать данные из сайта при запросе /balance.

Запуск в окружении разработчика
-------------------------------

```
cp .app-config.secrets.yml.example .app-config.secrets.yml

npm run build
npm run start
```

Сборка продакшн контейнера
--------------------------

```
cp .env.example .env
cp docker-compose.override.yml.example docker-compose.override.yml

docker compose build
docker compose up -d
docker compose logs
```

Тестирование
------------

```
# Сохраняем куку от Trending.bid
curl -v -X POST 'http://localhost:3000/auth' \
  -H 'Content-Type: application/json' \
  -d '{"session":"9f8a00a1f58f439583d278e2feed3484"}'

< HTTP/1.1 201 Created
< Content-Type: application/json; charset=utf-8
< 
{"success":true}

# Получаем баланс
curl -v -X GET 'http://localhost:3000/balance'

< HTTP/1.1 200 OK
< Content-Type: application/json; charset=utf-8
< 
{"success":true,"balance":0}

```

