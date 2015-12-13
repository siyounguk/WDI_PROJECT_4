angular
  .module('walks')
  .controller('walkController', WalksController);

WalksController.$inject = ['$resource', 'Walk'];
function WalksController($resource, Walk){

  var self = this;
  self.all =  Walk.query()

  self.getUsers = function() {

    self.all = User.query(function(data){
      return data.users;
      
    });
  }


}