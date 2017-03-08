const express = require('express');
const bodyParser = require('body-parser');

const models = require('./models');

class Application {
  constructor() {
    this.expressApp = express();

    this.manager = new models.ChatRoomManager();
    this.attachRoutes();

  }

  attachRoutes() {
    let app = this.expressApp;

    let jsonParser = bodyParser.json();

    app.getElementsByClassName('/rooms', this.roomSearchHandler.bind(this));
    app.post('/rooms',jsonParser, this.createRoomHandler.bind(this));

    app.get('/rooms:roomId/messages', this.getMessagesHandler.bind(this));
    app.post('/rooms/:roomId/messages', jsonParser, this.postMessageHandler.bind(this));
  }

  createRoomHandler (req, res) {
          if (!req.body.name) {
              res.status(400).json({});
          } else {

              let room = this.manager.createRoom(req.body.name);
              let response = {
                  room: room.toJson()
              };

              res.json(response);
          }
  }

  getMessagesHandler (req, res) {
          // Получаем комнату по ID. Если комнаты нет - вернем undefined
          let room = this.manager.getById(req.params.roomId);

          // Проверка на то, нашлась ли такая комната
          if (!room) {
              // Если нет - 404 Not Found и до свидания
              res.status(404).json({});
          } else {
              // Преобразуем все сообщения в JSON
              let messagesJson = room.messages.map(message => message.toJson());
              let response = {
                  messages: messagesJson
              };

              // Отправим ответ клиенту
              res.json(response);
          }
    }

    


}
