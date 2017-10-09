const express = require('express');
const app = express();
const mongoose = require('mongoose');

const Task = require('./task');
const User = require('./user');

mongoose.connect('mongodb://localhost:27017', {
  useMongoClient: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('connection ok:');
});



app.listen(process.env.PORT);

var data_base_api = express.Router();

data_base_api.get('/users/' || '/users', (req, res) => {
  User.find((err, data) => {
    if (err) return console.error(err)
    res.send(data);
  });
});

data_base_api.put('/users/add/:name', (req, res) => {
  var user = new User({ name: req.params.name })
  user.save((err) => {
    if (err) return console.error(err);
    res.send(`Пользователь ${user.name} успешно создан. Ваш id: ${user._id}`);
  });
});



data_base_api.post('/users/trans/:id/name/:name', (req, res) => {
  User.findById(req.params.id, (err, doc) => {
    if (err) console.error(err);
    doc.name = req.params.name;
    doc.save((err) => {
      if (err) return console.error(err);
      res.send(`Имя пользователя ${doc._id} успешно изменено на ${doc.name}.`);
    });
  })
});

data_base_api.delete('/users/delete/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, (err) => {
    if (err) return console.error(err);
    res.send(`Пользователя ${doc._id} успешно удален.`);
  })
});

data_base_api.get('/task' || '/task/', (req, res) => {
  Task.find((err, data) => {
    if (err) return console.error(err)
    res.send(data);
  });
});

data_base_api.get('/task/title/:title' || '/task/desc/:desc', (req, res) => {
  if (req.params.title) {
    Task.find({ title: req.params.title }, (err, data) => {
      if (err) return console.error(err);
      res.send(data)
    })
  }
  if (req.params.desc) {
    Task.find({ description: req.params.desc }, (err, data) => {
      if (err) return console.error(err);
      res.send(data);
    })
  }
});

data_base_api.put('/task/add/:title/desc/:desc', (req, res) => {
  var task = new Task({ title: req.params.title, description: req.params.desc });
  task.save((err) => {
    if (err) return console.error(err);
    res.send(`Задание ${task.title} добавлено в базу.`);
  })
});

data_base_api.post('/task/trans/:title/open/', (req, res) => {
  Task.findOne({ title: req.params.title }, (err, data) => {
    if (err) return console.error(err);
    data.open = true;
    data.save((err) => {
      if (err) console.error(err);
      res.send('Задание открыто.');
    })
  })
});

data_base_api.post('/task/trans/:title/close/', (req, res) => {
  Task.findOne({ title: req.params.title }, (err, data) => {
    if (err) return console.error(err);
    data.open = false;
    data.save((err) => {
      if (err) return console.error(err);
      res.send('Задание закрыто.');
    })
  })
});

data_base_api.post('/task/adduser/:user/title/:title', (req, res) => {
  User.findOne({ name: req.params.user }, (err, user) => {
    if (err) return console.error(err);
    Task.findOne({ title: req.params.title }, (err, data) => {
      if (err) return console.error(err);
      data.user = user;
      data.save((err) => {
        if (err) return console.error(err);
        res.send(`Задание ${data.title} делегировано на пользователя ${data.user.name}`)
      });
    })
  });
});

data_base_api.delete('/task/delete/:title', (req, res) => {
  Task.remove({ title: req.params.title }, (err) => {
    if (err) return console.error(err);
    res.send(`Здание ${req.params.title} успошно удалено.`);
  });
});


app.use('/data-base_api/v1/', data_base_api)