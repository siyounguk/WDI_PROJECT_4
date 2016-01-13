angular
  .module('walks')
  .factory('Walk', Walk);

Walk.$inject = ['$resource', 'API'];
function Walk($resource, API) {

  return $resource(API + '/walks/:id', null, {
    'newWalk': { method: "POST", url: API + '/newWalk'},
    'findRoute': { method: "GET", url: API + '/walks/find', params: { latitude: true, longitude: true, distance: true }, isArray: true }
  }); 
}