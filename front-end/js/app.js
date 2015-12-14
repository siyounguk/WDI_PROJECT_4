angular
  .module('walks', ['angular-jwt', 'ngResource', 'uiGmapgoogle-maps'])
  .constant('API', 'http://localhost:3000/api')
  .config(Interceptors)
  .config(GoogleMaps);

Interceptors.$inject = ['$httpProvider'];
function Interceptors($httpProvider){
  $httpProvider.interceptors.push('AuthInterceptor');
}

GoogleMaps.$inject = ['uiGmapGoogleMapApiProvider'];
function GoogleMaps(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAYfnw4ig2Iqff8oPSkiWzN5h0b0WNU_xU',
    v: '3.20',
    libraries: 'places'
  });
};
 

