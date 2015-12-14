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
      console.log(res);
      
      // Console.log our response from the API
      if(token) {
        console.log(res);
        // display agents
        self.getUsers();
        self.user = TokenService.getUser();
      }

      self.message = res.message;
    }

   


    self.login = function() {
      // this is running the function on our model
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

      // self.all = User.query(function(data){
      //   return data.users;
        
      // });

      User.query(function(data){
        self.all = data.users
      });
    }

    self.isLoggedIn = function(){
      // returns boolean value
      return !!TokenService.getToken();
    }

    if(self.isLoggedIn()){
      self.getUsers();
      self.user = TokenService.getUser();
    }
  }