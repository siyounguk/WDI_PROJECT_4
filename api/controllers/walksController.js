var Walk = require("../models/walk");
var User = require("../models/user");

function walksIndex(req, res){
  Walk.find({}, function(err, walks) {
    if (err) return res.status(404).send(err).json({message: 'Something went wrong with walks I.' + err});;
    res.status(200).json(walks);
  });
}

function walksCreate(req, res){
  var walk = new Walk(req.body);
  
  walk.save(function(err){
    if (err) return res.status(500).send(err);
    // console.log(err)

    var email = req.body.user.email;
    User.findOne({ email: email }, function(err, u){
       walk.user.push(u);
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

function walksFind(req, res, next) {  
    console.log(req.query)
    var limit = req.query.limit || 10;

    // get the max distance or set it to 8 kilometers
    var maxDistance = req.query.distance || 8;

    // we need to convert the distance to radians
    // the raduis of Earth is approximately 6371 kilometers
    maxDistance /= 6371;
    console.log(maxDistance)
    // // get coordinates [ <longitude> , <latitude> ]
    var coords = [];
    coords[0] = req.query.longitude;
    coords[1] = req.query.latitude;

    // find a location
    Walk.find({
      "origin.loc": {
        $near: coords,
        $maxDistance: maxDistance
      }
    }).limit(limit).exec(function(err, locations) {
      if (err) {
        console.log(err)
        return res.status(500).json(err);
      }
      res.status(200).json(locations);
    });
}


module.exports = {
  walksIndex: walksIndex,
  walksCreate: walksCreate,
  walksShow: walksShow,
  walksFind: walksFind
  // usersUpdate: usersUpdate,
  // usersDelete: usersDelete
}