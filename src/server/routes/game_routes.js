var Game = require('../models/Game');
var bodyparser = require('body-parser');

module.exports = function(router) {
  router.use(bodyparser.json());

  // deprecating this route since it just gets all games
  router.get('/games', function(req, res) {

    Game.find({}, {name: 1, id: 1, _id: 0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });

  // this route returns all games including private games for that user
  router.get('/games/:name', function(req, res) {

    Game.find({ $or: [ {between: req.params.name}, {private: false } ] }, {name: 1, id:1, private: 1, between: 1, _id:0}, function(err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  })

  // post a new user to game list db
  router.post('/games/new_game', function(req, res) {
    var newGame = new Game(req.body);
    newGame.save(function (err, data) {
      if(err) {
        console.log(err);
        return res.status(500).json({msg: 'internal server error'});
      }

      res.json(data);
    });
  });
}
