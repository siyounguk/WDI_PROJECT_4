var User = require('../models/user');

function usersIndex(req, res) {
  User.find(function(err, users){
    if (err) return res.status(404).json({message: 'Something went wrong with users I.' + err});
    res.status(200).json(users);
  });
}

function usersShow(req, res){
  User.findById(req.params.id, function(err, user){
    if (err) return res.status(404).json({message: 'Something went wrong.'});
    res.status(200).json(user);
  });
}

function usersUpdate(req, res){
  User.findById(req.params.id,  function(err, user) {
    if (err) return res.status(500).json({message: "Something went wrong!" + err});
    if (!user) return res.status(404).json({message: 'No user found.'});

    if (req.body.email) user.email = req.body.email;
    if (req.body.password) user.password = req.body.password;
    if (req.body.firstName) user.firstName = req.body.firstName;
    if (req.body.lastName) user.lastName = req.body.lastName;
    if (req.body.favouriteWalks) user.favouriteWalks.push(req.body.favouriteWalks);

    user.save(function(err) {
     if (err) return res.status(500).json({message: "Something went wrong with save!"});

      res.status(201).json(user);
    });
  });
}

function usersDelete(req, res){
  User.findByIdAndRemove({_id: req.params.id}, function(err){
   if (err) return res.status(404).json({message: 'Something went wrong.'});
   res.status(200).json({message: 'User has been successfully deleted'});
  });
}

module.exports = {
  usersIndex: usersIndex,
  usersShow: usersShow,
  usersUpdate: usersUpdate,
  usersDelete: usersDelete
}