angular
  .module('walks')
  .controller('walkController', WalksController);

WalksController.$inject = ['$window', '$scope','$resource', 'Walk', 'uiGmapGoogleMapApi', 'TokenService'];
function WalksController($window, $scope ,$resource, Walk, uiGmapGoogleMapApi, TokenService){
  var self = this;

  self.startEndClicked = false;
  self.waypointClicked = false;
  self.searchClicked = false;
  self.route = {
    stops: []
  };


  self.formData = { latitude: 51.51, longitude: -0.121, distance: 500 };

  route = self.route;
  var checkboxArray = [];

  uiGmapGoogleMapApi.then(function(maps) {
    var polylineOptions = new maps.Polyline({
      strokeColor: 'blue',
      strokeOpacity: 0.6,
      strokeWeight: 9
    });
    self.map = new maps.Map(document.getElementById('main-map'), { center: { lat: 51.5081, lng: -0.1000 }, zoom: 15 , styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7dcdcd"}]}], streetViewControl: false, panControl: false, mapTypeControl: false, zoomControlOptions: {
      style: google.maps.ZoomControlStyle.SMALL,
      position: google.maps.ControlPosition.RIGHT_CENTER
    } });

    self.infowindow = new maps.InfoWindow({map : self.map});
    self.infowindow.close();

    var inputFields = [].slice.call(document.getElementsByClassName('autocomplete'));
    inputFields.forEach(function(input) {
      var autocomplete = new maps.places.Autocomplete(input);
      autocomplete.bindTo('bounds', self.map);
      autocomplete.addListener('place_changed', function() {
        self[input.id + 'Place'] = autocomplete.getPlace();
      });
    });

    // self.geolocate = function() {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //       var pos = {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude
    //       };
    //       self.infoWindow.setPosition(pos);
    //       self.infoWindow.setContent('Location found.');
    //       self.map.setCenter(pos);
    //     }, function() {
    //       handleLocationError(true, self.infoWindow, self.map.getCenter());
    //     });
    //   } else {
    //     handleLocationError(false, self.infoWindow, self.map.getCenter());
    //   }
    // };

    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      self.infoWindow.setPosition(pos);
      self.infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
    }

    var rendererOptions = {
      map: self.map
    };

    self.directionsService = new maps.DirectionsService();
    self.directionsDisplay = new maps.DirectionsRenderer(rendererOptions);
    self.directionsDisplay.setMap(self.map);
    self.text = "add stop?";

    var directionsServiceRouteObject = {
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING
    };

    var directionsServiceRouteFunc = function(response, status) {
      // self.directionsDisplay.suppressMarkers = true;
      if (status === google.maps.DirectionsStatus.OK)
       {
        self.directionsDisplay.setDirections(response);
        var route = response.routes[0];
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    };

    self.clearMap = function (){
      self.directionsDisplay.setOptions({ suppressMarkers: true });
      self.directionsDisplay = null;
    };

    self.addRoute = function(){
      self.route.user = TokenService.getUser();
      originLoc = self.originPlace.geometry.location;

      self.route.origin = {
        place_id: self.originPlace.place_id,
        loc: [originLoc.lng(), originLoc.lat()],
        formatted_address: self.originPlace.formatted_address,
        name: self.originPlace.name
      };
      routeOrigin = self.route.origin;
      route.origin = routeOrigin;

      destLoc = self.destinationPlace.geometry.location;

      self.route.destination = {
        place_id: self.destinationPlace.place_id,
        loc: [destLoc.lng(), destLoc.lat()],
        formatted_address: self.destinationPlace.formatted_address,
        name: self.destinationPlace.name
      };
      routeDestination = self.route.destination;
      route.destination = routeDestination;

      Walk.save(self.route);
    };

    self.calculateAndDisplayRoute = function (directionsService, directionsDisplay) {

      self.startEndClicked = true;

      directionsServiceRouteObject.origin = self.originPlace.geometry.location;
      directionsServiceRouteObject.destination = self.destinationPlace.geometry.location;

      var waypts = [];
      console.log(self.route)

      for (var i = 0; i < checkboxArray.length; i++) {
        waypts.push({
          location: self.route.stops[i].formatted_address,
          stopover: true
        });
      }

      console.log(waypts)

      directionsServiceRouteObject.waypoints = waypts;

      self.directionsService.route(directionsServiceRouteObject, directionsServiceRouteFunc);
      self.waypointPlace = "";
    };

    self.addLocation = function (){
      self.text = "add another stop?";
      self.waypointClicked = true;
      self.infowindow.close();
      var stop = self.waypointPlace;
      // console.log(stop)

      if (!stop.geometry) {
        window.alert("Autocomplete's returned stop contains no geometry");
        return;
      }

      stopLoc = stop.geometry.location;
      self.route.stops.push({
        place_id: stop.id,
        loc: [stopLoc.lng(), stopLoc.lat()],
        formatted_address: stop.formatted_address,
        name: stop.name
      });


      checkboxArray.push(stop);
      self.calculateAndDisplayRoute(self.directionsService, self.directionsDisplay);
      if (stop.geometry.viewport) {
        self.map.fitBounds(stop.geometry.viewport);
      } else {
        self.map.setCenter(stop.geometry.location);
        self.map.setZoom(17);
      }

      
      // self.marker.setPosition(stop.geometry.location);
      // self.marker.setVisible(true);
    };
    self.searchResults = [];

    self.searchWalks = function(){
      self.searchClicked = true;
      self.distance = document.getElementById('distance-select');
      distance = self.distance.options[self.distance.selectedIndex].value;

      distNum = parseFloat(distance);

      self.searchParams = {
          latitude: self.searchPlace.geometry.location.lat(),
          longitude: self.searchPlace.geometry.location.lng(),
          distance: distNum
      };


      Walk.findRoute(self.searchParams, function(data){
         self.searchResults = data;
      });
    };

    self.selectWalk = function(walk) {
      self.selectedWalk = Walk.get({ id: walk._id });
      self.selectedWalk.$promise.then(function(data){

          self.selectedWalk = data;
          self.calculateSavedRoute(self.directionsService, self.directionsDisplay);
      });
    };

    self.calculateSavedRoute = function (directionsService, directionsDisplay) {
      directionsServiceRouteObject.origin = self.selectedWalk.origin.formatted_address;
      directionsServiceRouteObject.destination = self.selectedWalk.destination.formatted_address;
      var waypts = [];



      for (var i = 0; i < self.selectedWalk.stops.length; i++) {
        waypts.push({
          location: self.selectedWalk.stops[i].formatted_address,
          stopover: true
        });
      }

      directionsServiceRouteObject.waypoints = waypts;
      self.directionsService.route(directionsServiceRouteObject, directionsServiceRouteFunc);
    };
  });
  self.walk = {};
  self.all =  Walk.query();
}
