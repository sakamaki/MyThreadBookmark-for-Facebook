'use strict';
angular.module('MyThread.controllers', [])
  .controller('TabsCtrl', function ($scope, Authentication, Facebook) {
    fbRefresh($scope, Facebook);
  })

  .controller('DashCtrl', function ($scope, Facebook, Bookmark, Authentication) {
    $scope.bookmarks = Bookmark.all();
    $scope.isRequireLogin = false;
    $scope.showEmptyDiv = function () {
      Authentication.getLoginStatus().then(function (isLoggedIn) {
        if (isLoggedIn === false) {
          $scope.isRequireLogin = true;
        } else {
          $scope.isRequireLogin = false;
        }
      });
    };
    $scope.showFacebookThread = function (messageId) {
      var tokens = messageId.split('_');
      window.open(
        'https://www.facebook.com/' + tokens[0] + '/posts/' + tokens[1],
        '_blank'
      );
    };
  })

  .controller('FriendsCtrl', function ($scope, Friends, Authentication, Facebook, $state) {
    $scope.groups = {};
    $scope.init = function () {
      Authentication.groups().then(function(response) {
        if (response.data) {
          Friends.set(response.data);
          $scope.groups = response.data;
        }
      })
    };
    $scope.showDetailView = function (groupId) {
      $state.go('tab.friend-detail', {groupId: groupId});
    };
  })

  .controller('FriendDetailCtrl', function ($scope, $stateParams, Friends, Authentication, $ionicActionSheet, Bookmark) {
    $scope.groupId = $stateParams.groupId;
    $scope.group = Friends.get($scope.groupId);
    $scope.messages = [];
    $scope.showActionSheet = function (index) {
      $ionicActionSheet.show({
        titleText: 'Menu',
        buttons: [
          { text: 'Add Bookmark <i class="icon ion-share"></i>' }
        ],
        cancelText: 'Cancel',
        cancel: function() {
          console.log('CANCELLED');
        },
        buttonClicked: function() {
          console.log('BUTTON CLICKED', index);
          Bookmark.create($scope.messages[index], $scope.group);
          return true;
        }
      });
    };
    $scope.init = function () {
      Authentication.groupThreadList($scope.groupId).then(function (response) {
        $scope.messages = response.data;
      });
    };
  })

  .controller('AccountCtrl', function ($scope, Facebook) {
    // Define user empty data :/
    $scope.user = {};

    // Defining user logged status
    $scope.logged = false;

    // And some fancy flags to display messages upon user status change
    $scope.byebye = false;
    $scope.salutation = false;

    var userIsConnected = false;

    Facebook.getLoginStatus(function(response) {
      if (response.status == 'connected') {
        userIsConnected = true;
      }
    });

    /**
     * IntentLogin
     */
    $scope.IntentLogin = function() {
      if(!userIsConnected) {
        $scope.login();
      }
    };

    /**
     * Login
     */
    $scope.login = function() {
      Facebook.login(function(response) {
        if (response.status == 'connected') {
          $scope.logged = true;
          $scope.me();
        }

      });
    };

    /**
     * Logout
     */
    $scope.logout = function () {
      Facebook.logout(function () {
        $scope.$apply(function () {
          $scope.user = {};
          $scope.logged = false;
        });
      });
    };

    /**
     * Taking approach of Events :D
     */
    $scope.$on('Facebook:statusChange', function(ev, data) {
      console.log('Status: ', data);
      if (data.status == 'connected') {
        $scope.$apply(function() {
          $scope.salutation = true;
          $scope.byebye     = false;
        });
      } else {
        $scope.$apply(function() {
          $scope.salutation = false;
          $scope.byebye     = true;

          // Dismiss byebye message after two seconds
          $timeout(function() {
            $scope.byebye = false;
          }, 2000)
        });
      }
    });
  });

function fbRefresh($scope, Facebook) {
  $scope.$watch(
    function() {
      return Facebook.isReady();
    },
    function(newVal) {
      if (newVal)
        $scope.facebookReady = true;
    }
  );
}
