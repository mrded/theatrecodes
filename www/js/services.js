angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Codes', function($http, $q, $ionicLoading) {
  var host = 'http://theatrecodes.co.uk';
  var db = {};
  
  document.addEventListener("deviceready", function() {
    db = window.sqlitePlugin.openDatabase({name: "storage.db"});
    
    // db.executeSql('DROP TABLE IF EXISTS codes');
    db.transaction(function(tx) {
      tx.executeSql("select name from sqlite_master where type='table' AND name='codes';", [], function(tx, res) {
        if (res.rows.length == 0) {
          console.log('CREATE TABLE');
          $ionicLoading.show({template: 'Getting new codes'});
          
          db.executeSql('CREATE TABLE IF NOT EXISTS codes (id varchar(5) primary key, description text)');
  
          console.log('GET NEW CODES');
          $http.get(host + '/codes/').success(function(result) {
            
            db.transaction(function(tx) {
              angular.forEach(result, function(code) {
                tx.executeSql("INSERT INTO codes (id, description) VALUES (?,?)", [code.name, code.description], function(tx, res) {
                  console.log('INSERT', JSON.stringify(res.rows.insertId));
                });
              });
            }, function(e) { console.log("ERROR", e.message); });
  
            $ionicLoading.hide();
          });
        }
        else console.log('Load codes');
      });
    });
  }, false);
  
  return {
    get: function(codeId) {
      var deferred = $q.defer();

      db.executeSql("select * from codes where id = '{codeId}';".replace('{codeId}', codeId), [], function(res) {
        return deferred.resolve(res.rows.item(0));
      });

      return deferred.promise;
    },
    search: function(searchText) {
      var deferred = $q.defer();
      var codes = [];
      
      db.executeSql("select * from codes where description like '%{search}%' or id like '%{search}%';".replace('{search}', searchText), [], function(res) {
        for (i = 0; i < res.rows.length; i++) {
          codes.push(res.rows.item(i));
        }
        return deferred.resolve(codes);
      });
      
      return deferred.promise;
    }
  }
});
