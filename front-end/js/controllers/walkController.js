angular
  .module('walks')
  .controller('walkController', WalksController);

WalksController.$inject = ['$window', '$scope','$resource', 'Walk', 'uiGmapGoogleMapApi', 'TokenService'];
function WalksController($window, $scope ,$resource, Walk, uiGmapGoogleMapApi, TokenService){
  var self = this;

  self.route = {
    stops: []
  };

  self.formData = {}

  route = self.route

  var checkboxArray = []

  uiGmapGoogleMapApi.then(function(maps) {
    var polylineOptions = new maps.Polyline({
      strokeColor: 'blue',
      strokeOpacity: 0.6,
      strokeWeight: 9,
    });
    self.map = new maps.Map(document.getElementById('main-map'), { center: { lat: 51.5081, lng: -0.1000 }, zoom: 14 });

    self.infowindow = new maps.InfoWindow({map : self.map});
    self.geolocate = function() {
      
      console.log(self.map)
      console.log(self.infowindow)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          console.log(self.infowindow)
          self.infoWindow.setPosition(pos);
          self.infoWindow.setContent('Location found.');
          console.log(self.infoWindow.setContent('Location found.'))
          self.map.setCenter(pos);
        }, function() {
          handleLocationError(true, self.infoWindow, self.map.getCenter());
        });
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, self.infoWindow, self.map.getCenter());
      }
    }

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      self.infoWindow.setPosition(pos);
      self.infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    }

    self.directionsService = new maps.DirectionsService;
    self.directionsDisplay = new maps.DirectionsRenderer(rendererOptions)
    self.directionsDisplay.suppressMarkers = true
    self.directionsDisplay.setMap(self.map);
    var rendererOptions = {
      map: self.map,
      suppressInfoWindows: true,
      suppressMarkers: true,
      polylineOptions: polylineOptions
    };

    // self.infowindow = new maps.InfoWindow({map : self.map});
    self.marker = new maps.Marker({
      map: self.map,
      anchorPoint: new maps.Point(0, -29)
    });

    self.input = document.getElementById('pac-input');
    self.autocomplete = new maps.places.Autocomplete(self.input);
    self.autocomplete.bindTo('bounds', self.map); 
   
    self.startInput = document.getElementById('start');
    var startAutocomplete = new maps.places.Autocomplete(self.startInput);
    startAutocomplete.bindTo('bounds', self.map);
    self.originPlace = startAutocomplete.getPlace()
   
    self.endInput = document.getElementById('end');
    var endAutocomplete = new maps.places.Autocomplete(self.endInput);
    endAutocomplete.bindTo('bounds', self.map);
    self.destinationPlace = endAutocomplete.getPlace()

    self.addRoute = function(){
      self.route.user = TokenService.getUser();
       // = self.user 
      self.originPlace = startAutocomplete.getPlace()
      self.destinationPlace = endAutocomplete.getPlace()

      originLoc = self.originPlace.geometry.location

      self.route.origin = {
        place_id: self.originPlace.place_id,
        loc: [originLoc.lng(), originLoc.lat()],
        formatted_address: self.originPlace.formatted_address,
        name: self.originPlace.name
      }
      routeOrigin = self.route.origin
      route.origin = routeOrigin
  
      destLoc = self.destinationPlace.geometry.location
      
      self.route.destination = {
        place_id: self.destinationPlace.place_id,
        loc: [destLoc.lng(), destLoc.lat()],
        formatted_address: self.destinationPlace.formatted_address,
        name: self.destinationPlace.name
      }
      routeDestination = self.route.destination
      route.destination = routeDestination      

      console.log(route.stops)
      console.log(self.route.user)
  
      
      Walk.save(self.route)
    }

    self.calculateAndDisplayRoute = function (directionsService, directionsDisplay) {
      
      // console.log(originPlaceId)
      // if (originPlace.photos){
      //   console.log(originPlace.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}))
      // }
      var originPlace = startAutocomplete.getPlace()
      var destinationPlace = endAutocomplete.getPlace()
      // console.log(originPlace)
      // console.log(originPlace.geometry.location)

      var waypts = [];

      for (var i = 0; i < checkboxArray.length; i++) {  
        waypts.push({
          location: checkboxArray[i].formatted_address,
          stopover: true
        })  
        // placesList.innerHTML += '<li>' + checkboxArray[i].name + '<img src='+checkboxArray.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100})+'>'+'</li>'
      }

      self.directionsService.route({
        origin: originPlace.geometry.location,
        destination: destinationPlace.geometry.location,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.WALKING,
      }, function(response, status) {
        self.directionsDisplay.suppressMarkers = true
        if (status === google.maps.DirectionsStatus.OK) {
          self.directionsDisplay.setDirections(response);
          var route = response.routes[0];

          var summaryPanel = document.getElementById('directions-panel');
          summaryPanel.innerHTML = '';
          // For each route, display summary information.
          for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i + 1;
            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                '</b><br>';
            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
            summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
          }
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }) 
    }
    self.addLocation = function (){
      self.infowindow.close();
      self.marker.setVisible(false);
      var stop = self.autocomplete.getPlace();
      if (!stop.geometry) {
        window.alert("Autocomplete's returned stop contains no geometry");
        return;
      }

      stopLoc = stop.geometry.location
      self.route.stops.push({
        place_id: stop.id,
        loc: [stopLoc.lng(), stopLoc.lat()],
        formatted_address: stop.formatted_address,
        name: stop.name
      }) 

      checkboxArray.push(stop)
      self.calculateAndDisplayRoute(self.directionsService, self.directionsDisplay)
      if (stop.geometry.viewport) {
        self.map.fitBounds(stop.geometry.viewport);
      } else {
        self.map.setCenter(stop.geometry.location);
        self.map.setZoom(17);  // Why 17? Because it looks good.
      }
      self.marker.setIcon(/** @type {google.maps.Icon} */({
        url: stop.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      self.marker.setPosition(stop.geometry.location);
      self.marker.setVisible(true);

      var address = '';
      if (stop.address_components) {
        address = [
          (stop.address_components[0] && stop.address_components[0].short_name || ''),
          (stop.address_components[1] && stop.address_components[1].short_name || ''),
          (stop.address_components[2] && stop.address_components[2].short_name || '')
        ].join(' ');
      }


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

  self.searchWalks = function(){
    Walk.findRoute(function(data){
      console.log(data)
      loc: {
        $near: {-0.12671829999999318,
      51.5180173},
        $maxDistance: 800
      }
    })
  }

}