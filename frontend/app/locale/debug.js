function validateDependencies() {
  angular.module('app')._invokeQueue.forEach(validateDependenciesForType);

  angular.module('filters')._invokeQueue.forEach(validateDependenciesForType);

  angular.module('services')._invokeQueue.forEach(validateDependenciesForType);

  angular.module('filters')._invokeQueue.forEach(validateDependenciesForType);
}

function validateDependenciesForType(value) {
  var func = value[2][1].toString();
  var dependencies = func.substring(func.indexOf("(") + 1, func.indexOf(")")).split(",");
  for (var i = 0; i < dependencies.length; i++) {
    var dependency = dependencies[i].trim();
    if (dependency.indexOf("$") >= 0) {
      dependency = "\\" + dependency;
    }
    var regExp = new RegExp(dependency, "gi");
    var count = (func.match(regExp) || []).length;
    if (count == 1) {
      console.log(value[2][0] + " : " + dependency);
    }
  }
}

function validateResources() {
  angular.module('app',[]).run(function($http, $q) {

    /*var files = ['en', 'fi'];
    for (var i = 0; i < files.length; i++) {
      $http({url: "locale/{0}.json".format(files[i])}).then(function(response) {
        validateResourceFile(files[i], response.data);
      });
    }*/

    validate("en", en);

    function validate(language, locale) {
      for (key in locale) {
        if (locale.hasOwnProperty(key)) {
          locale[key] = false;
        }
      }

      var promises = [];

      var js = [
        "app.js",
        "services.js",
        "filters.js",
        "controllers.js"
      ];
      for (var i = 0; i < js.length; i++) {
        var promise = $http({url: "js/{0}".format(js[i])}).then(function(response) {
          var matches = response.data.match(/\$translate.instant\(("|')([A-Za-z0-9_\[\]]*?)("|')/g);
          if (isEmpty(matches)) {
            return;
          }

          for (var i = 0; i < matches.length; i++) {
            var match = matches[i].replace("$translate.instant", "").replace(/[^\w\s]/gi, '');
            if (locale[match] === undefined) {
              console.log(language + " : " + match);
            } else {
              locale[match] = true;
            }
          }
        });
        promises.push(promise);
      }

      var html = [
        "dashboard.html",
        "login.html"
       
      ];
      for (var i = 0; i < html.length; i++) {
         
        var promise = $http({url: "dashboard/{0}".format(html[i])}).then(function(response) {
          var matches = response.data.match(/(translate|translate-attr-placeholder)=("|')([A-Za-z0-9_\[\]]*?)("|')/g);
          if (isEmpty(matches)) {
            return;
          }

          for (var i = 0; i < matches.length; i++) {
            var match = matches[i].replace("translate=", "").replace("translate-attr-placeholder=", "").replace(/[^\w\s]/gi, '');
            if (locale[match] === undefined) {
              console.log(language + " : no match : " + match);
            } else {
              locale[match] = true;
            }
          }
        });

        promises.push(promise);
      }

      $q.all(promises).finally(function() {
        for (key in locale) {
          if (locale.hasOwnProperty(key)) {
            if (locale[key] === false && key.indexOf("Guide") == -1) {
              console.log(language + " : not used: " + key);
            }
          }
        }
      })
    }
  });
}

validateResources();

//validateDependencies();


