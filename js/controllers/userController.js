angular
  .module('walks')
  .controller('userController', UserController)

  UserController.$inject = ['User', 'TokenService']
  function UserController(User, TokenService) {
    var self = this;

    self.all    = [];

    self.user  = {};
    
    function handleLogin(res) {
      var token = res.token ? res.token : null;

      if(token) {
        self.getUsers();
        self.user = TokenService.getUser();
      }

      self.message = res.message;
    }


    self.login = function() {
      User.login(self.user, handleLogin);
    }

    self.register = function() {
      User.register(self.user, handleLogin);
    }

    self.disappear = function() {
      TokenService.removeToken();
      self.all = [];
      self.user = {};
    }

    self.getUsers = function() {
      self.all = User.query();
    }

    self.isLoggedIn = function(){
      return !!TokenService.getToken();
    }

    if(self.isLoggedIn()){
      self.getUsers();
      self.user = TokenService.getUser();
    }
  }