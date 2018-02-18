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

data_base_api.put('/users/add', (req, res) => { // /users/add?name=name
  var user = new User({ 'name': req.query.name })
  user.save((err) => {
    if (err) return console.error(err);
    res.send(`Пользователь ${user.name} успешно создан. Ваш id: ${user._id}`);
  });
});



data_base_api.post('/users/trans', (req, res) => { // /users/trans?id=id&name=name
  User.findById(req.query.id, (err, doc) => {
    if (err) console.error(err);
    doc.name = req.query.name;
    doc.save((err) => {
      if (err) return console.error(err);
      res.send(`Имя пользователя ${doc._id} успешно изменено на ${doc.name}.`);
    });
  })
});

data_base_api.delete('/users/delete', (req, res) => { // /users/delete?id=id
  User.findByIdAndRemove(req.query.id, (err) => {
    if (err) return console.error(err);
    res.send(`Пользователь успешно удален.`);
  })
});

data_base_api.get('/tasks' || '/tasks/', (req, res) => {
  Task.find((err, data) => {
    if (err) return console.error(err)
    res.send(data);
  });
});

data_base_api.get('/task/title' || '/task/desc', (req, res) => { // /task/title?title=title || task/desc?desc=desc
  if (req.query.title) {
    Task.find({ title: req.query.title }, (err, data) => {
      if (err) return console.error(err);
      res.send(data)
    })
  }
  if (req.query.desc) {
    Task.find({ description: req.query.desc }, (err, data) => {
      if (err) return console.error(err);
      res.send(data);
    })
  }
});

data_base_api.put('/tasks/add', (req, res) => { // /tasks/add?title=title&desc=desc
  var task = new Task({ title: req.params.title, description: req.params.desc });
  task.save((err) => {
    if (err) return console.error(err);
    res.send(`Задание ${task.title} добавлено в базу.`);
  })
});

data_base_api.post('/task/:id', (req, res) => { // /task/:id?open= true||false
  Task.findById(req.params.id, (err, data) => {
    if (err) return console.error(err);
    if (req.query.open === 'true') data.open = true;
    if (req.query.open === 'false') data.open = false;
    data.save((err) => {
      if (err) console.error(err);
      res.send('Задание открыто.');
    })
  })
});

data_base_api.post('/task/:id/update', (req, res) => { // /task/:id/update?title=title&desc=desc
  Task.findById(req.params.id, (err, data) => {
    if (err) return console.error(err);
    data.title = req.query.title;
    data.description = req.query.desc;
    data.save((err) => {
      if (err) console.error(err);
      res.send('Задание обновлено.');
    })
  })
});

data_base_api.post('/task/:id/adduser', (req, res) => { // /task/:title/adduser?user=name
  Task.findById(req.params.id, (err, task) => {
    if (err) return console.error(err);
    User.findOne({ name: req.query.user }, (err, user) => {
      if (err) return console.error(err);
      task.user = user;
      task.save((err) => {
        if (err) return console.error(err);
        res.send(`Задание ${task.title} делегировано на пользователя ${data.user.name}`)
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