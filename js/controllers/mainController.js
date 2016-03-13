angular
  .module('walks')
  .controller('mainController', MainController);

MainController.$inject = ['$scope', '$state'];
function MainController ($scope, $state) {
  $scope.state = $state;
}
