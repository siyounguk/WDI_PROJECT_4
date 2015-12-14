angular
  .module('walks')
  .controller('walkController', WalksController);

WalksController.$inject = ['$window', '$scope','$resource', 'Walk', 'uiGmapGoogleMapApi', 'TokenService'];
function WalksController($window, $scope ,$resource, Walk, uiGmapGoogleMapApi, TokenService){
  var self = this;

  self.user = TokenService.getUser();

  self.route = {
    place_id: {},
    origin: {},
    stops: [],
    destination: {}, 
    description: {},
    photo: {},
    user: {}
  };
  route = self.route

  uiGmapGoogleMapApi.then(function(maps) {
    var polylineOptions = new maps.Polyline({
      strokeColor: 'blue',
      strokeOpacity: 0.6,
      strokeWeight: 9,
    });
    self.map = new maps.Map(document.getElementById('main-map'), { center: { lat: 51.5081, lng: -0.1000 }, zoom: 14 });
    // $scope.options = { scrollwheel: false };

    self.directionsService = new maps.DirectionsService;
    self.directionsDisplay = new maps.DirectionsRenderer(rendererOptions)
    self.directionsDisplay.suppressMarkers = true

    var rendererOptions = {
      map: self.map,
      suppressInfoWindows: true,
      suppressMarkers: true,
      polylineOptions: polylineOptions
    };

    // var infowindow = new maps.InfoWindow();
    // var marker = new maps.Marker({
    //   map: self.map,
    //   anchorPoint: new maps.Point(0, -29)
    // });
    self.description = document.getElementById('#description');
    self.photo = document.getElementById('#photo');

    self.input = document.getElementById('pac-input');
    self.autocomplete = new maps.places.Autocomplete(self.input);
    self.autocomplete.bindTo('bounds', self.map); 
   
   self.startInput = document.getElementById('start');
   var startAutocomplete = new maps.places.Autocomplete(self.startInput);
   startAutocomplete.bindTo('bounds', self.map);
   
   self.endInput = document.getElementById('end');
   var endAutocomplete = new maps.places.Autocomplete(self.endInput);
   endAutocomplete.bindTo('bounds', self.map);
   self.startEndForm = document.getElementById('start-end-form')
   self.startEndForm.addEventListener('submit', function() {
       event.preventDefault()
       var originPlace = startAutocomplete.getPlace()
       self.route.origin = {
         place_id: originPlace.id,
         lat: originPlace.geometry.location.lat(),
         lng: originPlace.geometry.location.lng(),
         formatted_address: originPlace.formatted_address,
         name: originPlace.name
       }
       routeOrigin = self.route.origin
       route.origin = routeOrigin

       var destinationPlace = endAutocomplete.getPlace()
       self.route.destination = {
         place_id: destinationPlace.id,
         lat: destinationPlace.geometry.location.lat(),
         lng: destinationPlace.geometry.location.lng(),
         formatted_address: destinationPlace.formatted_address,
         name: destinationPlace.name
       }
       routeDestination = self.route.destination
       route.destination = routeDestination

       var stop = self.autocomplete.getPlace();
       self.route.stops.push({
         place_id: stop.id,
         lat: stop.geometry.location.lat(),
         lng: stop.geometry.location.lng(),
         formatted_address: stop.formatted_address,
         name: stop.name
       })
       self.route.user = self.user._id
       self.route.description = self.description
       console.log(self.description )
       self.route.photo = self.photo
       // routeStop = self.route.stops
       console.log(route.stops)
       // route.stops.push(routeStop)
       console.log(self.route)

       // self.addRoute()
       // Walk.save(self.route, function(walk) {
       //   self.walks.push(walk);
       //   self.walk = {}
       // })
    })
  });
  
    


  
  self.walk = {}
  

  self.all =  Walk.query(function(data){
      self.all = data.walks
    })

  self.getWalks = function() {
    Walk.query(function(data){
      self.all = data.walks
    });
  }
}