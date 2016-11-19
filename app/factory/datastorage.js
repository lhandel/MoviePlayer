angular.module('app.datastorage', [])

.factory('$datastorage', function($q) {

  var db = {};

  db.favorites = new Datastore({filename: path.join(application.getPath('userData'), 'storage/favorites.db'), autoload: true });
  db.activity = new Datastore({filename: path.join(application.getPath('userData'), 'storage/activity.db'), autoload: true });
  console.log(application.getPath('userData'), 'storage/activity.db');

	return {
		saveFavorite: function(object){
      var defer = $q.defer();
      db.favorites.insert(object,function(err,newDocs){
        if(err==null){
          defer.resolve(true);
        }else{
          defer.reject(err)
        }
      });
      return defer.promise;
		},
    removeFavorite: function(object) {
      var defer = $q.defer();
      db.favorites.remove({id:object.id}, { multi: true }, function (err, numRemoved) {
        if(err==null){
          defer.resolve(true);
        }else{
          defer.reject(err)
        }
      });
      return defer.promise;
    },
    isFavorite: function(object){
      var defer = $q.defer();
      db.favorites.count({ id: object.id }, function (err, count) {
        defer.resolve((count==0)? false : true);
      });
      return defer.promise;
    },
    getFavorites: function(){
        var defer = $q.defer();
        db.favorites.find({}, function (err, docs) {
          if(err==null){
            defer.resolve(docs);
          }else{
            defer.reject(err);
          }
        });
        return defer.promise;
    },
    markAsViewed: function(data){
      var defer = $q.defer();
      var object = {
          id: data.id,
          episode_id: (typeof(data.episode_id) == 'undefined')? '' : data.episode_id,
          date: Date.now()
      };
      db.activity.insert(object,function(err,newDocs){
        if(err==null){
          defer.resolve(true);
        }else{
          defer.reject(err)
        }
      });

      return defer.promise;
    },
    getShowedEpisodes: function(movie){
      var defer = $q.defer();
      db.activity.find({id:movie.id}, function (err, docs) {
        if(err==null){
          var return_id  = new Array();
          for(var i=0; i<docs.length; i++){
            return_id.push(docs[i].episode_id);
          }
          defer.resolve(return_id);
        }else{
          defer.reject(err);
        }
      });
      return defer.promise;
    }
	};

});


/*
var db = {};
console.log(path.join(application.getPath('userData'), 'datafile'));
db.favorites = new Datastore({filename: path.join(application.getPath('userData'), 'datafile'), autoload: true });
db.favorites.insert([{ b: 5 }, { a: 42 }], function (err, newDocs) {
  console.log(newDocs);
});
db.favorites.find({}, function (err, docs) {
    console.log(docs);
});
*/
