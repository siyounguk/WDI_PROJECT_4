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
    // self.description = document.getElementById('description').value;
    // self.photo = document.getElementById('photo').value;

    self.input = document.getElementById('pac-input');
    self.autocomplete = new maps.places.Autocomplete(self.input);
    self.autocomplete.bindTo('bounds', self.map); 
   
    self.startInput = document.getElementById('start');
    var startAutocomplete = new maps.places.Autocomplete(self.startInput);
    startAutocomplete.bindTo('bounds', self.map);
    var originPlace = startAutocomplete.getPlace()
   
    self.endInput = document.getElementById('end');
    var endAutocomplete = new maps.places.Autocomplete(self.endInput);
    endAutocomplete.bindTo('bounds', self.map);
    var destinationPlace = endAutocomplete.getPlace()

    self.addRoute = function(){
      event.preventDefault()
      self.route.origin = {
        place_id: originPlace.id,
        lat: originPlace.geometry.location.lat(),
        lng: originPlace.geometry.location.lng(),
        formatted_address: originPlace.formatted_address,
        name: originPlace.name
      }
      routeOrigin = self.route.origin
      route.origin = routeOrigin
  
      
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
      console.log(route.stops)
      console.log(self.route)
  
      
      Walk.save(self.route)
    }

    self.calculateAndDisplayRoute = function (directionsService, directionsDisplay) {
      console.log("Clicked")
      console.log(originPlace)
      // console.log(originPlaceId)
      // if (originPlace.photos){
      //   console.log(originPlace.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}))
      // }
          

      var waypts = [];

      for (var i = 0; i < checkboxArray.length; i++) {  
        waypts.push({
          location: checkboxArray[i].formatted_address,
          stopover: true
        })  
        // placesList.innerHTML += '<li>' + checkboxArray[i].name + '<img src='+checkboxArray.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})+'>'+'</li>'
      }

      directionsService.route({
        origin: originPlace.formatted_address,
        destination: destinationPlace.formatted_address,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
      }, function(response, status) {
        directionsDisplay.suppressMarkers = true
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          var route = response.routes[0];

          // var summaryPanel = document.getElementById('directions-panel');
          // summaryPanel.innerHTML = '';
          // // For each route, display summary information.
          // for (var i = 0; i < route.legs.length; i++) {
          //   var routeSegment = i + 1;
          //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
          //       '</b><br>';
          //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
          // }
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }) 
    }

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