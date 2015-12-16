angular
  .module('walks')
  .factory('AuthInterceptor', AuthInterceptor)

// Interceptor is an angular method

AuthInterceptor.$inject = ['API', 'TokenService'];
function AuthInterceptor(API, TokenService){
  return {
    request: function(config){
      var token = TokenService.getToken();

      if(config.url.match(API) && token){
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },

    response: function(res){
      // res.config.url.match(API) - checking that response is coming from API
      // res.data.token ==> will contain token from server
      if(res.config.url.match(API) && res.data.token){
        TokenService.saveToken(res.data.token);
      }
      return res;
    }
  }
}