angular
  .module('walks')
  .factory('Walk', Walk);

Walk.$inject = ['$resource', 'API'];
function Walk($resource, API) {


  return $resource(API + '/walks/:id', null, {
    'newWalk': { method: "POST", url: API + '/newWalk'},
    'query': { method: "GET", isArray: false }, 
    'findRoute': {method: "GET", url: API + '/walks/find'}
  }); 

  
}