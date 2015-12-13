var Walk = require("../models/walk");
var User = require("../models/user");

function walksIndex(req, res){
  Walk.find({}, function(err, walks) {
    if (err) return res.status(404).send(err).json({message: 'Something went wrong with walks I.' + err});;
    res.status(200).json({ walks: walks });
  });
}

function walksCreate(req, res){
  var walk = new Walk(req.body);

  
  walk.save(function(err){
    if (err) return res.status(500).send(err);
    console.log(req.body)
    var email = req.body.email;
    User.findOne({ email: email }, function(err, user){
       walk.users.push(user);
       walk.save();
       console.log(walk)
    });
    res.status(201).send(walk)
  });
}

function walksShow(req, res){
  var id = req.params.id;

  Walk.findById({ _id: id }).populate("projects").exec(function(err, walk) {
    if (err) return res.status(500).send(err);
    if (!walk) return res.status(404).send(err);

    res.status(200).send(walk);
  })
}



module.exports = {
  walksIndex: walksIndex,
  walksCreate: walksCreate,
  walksShow: walksShow
  // usersUpdate: usersUpdate,
  // usersDelete: usersDelete
}