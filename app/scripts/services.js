'use strict';
angular.module('MyThread.services', [])
/**
 * A simple example service that returns some data.
 */
  .service('Authentication', function Authentication(Facebook, $q) {
    this.login = function() {
      var deferred = $q.defer();
      Facebook.login(function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    this.getLoginStatus = function() {
      var deferred = $q.defer();
      Facebook.getLoginStatus(function(response) {
        deferred.resolve(response.status === 'connected');
      });
      return deferred.promise;
    };

    this.me = function() {
      var deferred = $q.defer();
      Facebook.api('/me', function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    this.groups = function () {
      var deferred = $q.defer();
      Facebook.api('/me/groups?fields=id,icon,name', function(response) {
        console.log(response);
        deferred.resolve(response);
      });
      return deferred.promise;
    };

    this.groupThreadList = function (groupId) {
      var deferred = $q.defer();
      console.log('/' + groupId + '/feed?limit=10');
      Facebook.api('/' + groupId + '/feed?limit=10', function(response) {
        deferred.resolve(response);
      });
      return deferred.promise;
    };
  })

  .factory('Bookmark', function(localStorageService) {
    return {
      all: function() {
        return localStorageService.get('bookmark');
      },
      create: function(message, group) {
        console.log(message);
        var out = {
          groupName: group.name,
          groupIcon: group.icon,
          messageId: message.id,
          message: message.message,
          createdTime: message.created_time,
          updatedTime: message.updated_time,
          threadOwnerName: message.from.name,
          threadOwnerId: message.from.id
        };
        var result = {};
        var bookmark = localStorageService.get('bookmark');
        if (bookmark) {
          result = bookmark;
        }
        result[message.created_time] = out;
        localStorageService.set('bookmark', result);
      }
    };
  })
  .factory('Friends', function() {
    // Might use a resource here that returns a JSON array

    // Some fake testing data
    var friends = [];

    return {
      set: function(groups) {
        friends = groups;
      },
      get: function(groupId) {
        return _.find(friends, function (group) {
          return group.id === String(groupId);
        });
      }
    };
  });
