angular
  .module('walks', ['angular-jwt', 'ngResource', 'uiGmapgoogle-maps', 'ui.router'])
  .constant('API', 'http://serene-sierra-1004.herokuapp.com/api')
  .config(Interceptors)
  .config(GoogleMaps)
  .config(MainRouter)
  
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

function MainRouter($stateProvider, $urlRouterProvider, $locationProvider){
  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "home.html"
    })
    .state('login', {
      url: "/login",
      templateUrl: "login.html"
    })
    .state('register', {
      url: "/register",
      templateUrl: "register.html"
    })
    .state('search', {
      url: "/search",
      templateUrl: "search.html",
    })
    .state('search-again', {
      url: "/search",
      templateUrl: "search.html",
    })
    .state('add', {
      url: "/add",
      templateUrl: "add.html"
    })
  $urlRouterProvider.otherwise("/");
}
 

