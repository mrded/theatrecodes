// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform, $ionicLoading, $http) {
  document.addEventListener("deviceready", function() {
    var db = window.sqlitePlugin.openDatabase({name: "storage.db"});
    
    db.transaction(function(tx) {
      tx.executeSql("select name from sqlite_master where type='table' AND name='codes';", [], function(tx, res) {
        if (res.rows.length == 0) {
          $ionicLoading.show({template: 'Getting new codes'});
          
          tx.executeSql('CREATE TABLE IF NOT EXISTS codes (id varchar(5) primary key, description text)');
  
          $http.get(host + '/codes/').success(function(result) {
            angular.forEach(result.data, function(code) {
              tx.executeSql("INSERT INTO codes (id, description) VALUES (?,?)", [code.id, code.description]);
            });
  
            $ionicLoading.hide();
          });
        }
      });
    });
  }, false);
  
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:
    .state('tab.codes', {
      url: '/codes',
      views: {
        'tab-codes': {
          templateUrl: 'templates/tab-codes.html',
          controller: 'CodesCtrl'
        }
      }
    })
    .state('tab.code-detail', {
      url: '/code/:codeId',
      views: {
        'tab-codes': {
          templateUrl: 'templates/code-detail.html',
          controller: 'CodeDetailCtrl'
        }
      }
    })

    .state('tab.support', {
      url: '/support',
      views: {
        'tab-support': {
          templateUrl: 'templates/tab-support.html'
        }
      }
    })

    .state('tab.about', {
      url: '/about',
      views: {
        'tab-about': {
          templateUrl: 'templates/tab-about.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/codes');

});

