angular.module('HelloWorldApp', ['google.spreadsheet.i18n.angular'])
  .controller('HelloWorldController', function($scope, googleSpreadsheetI18nAngular) {
    $scope.helloworld = "Hello World";

    googleSpreadsheetI18nAngular.init(
      "1QUICVJzTyIDcH2vk3UfnR4t0seo4r-cs3GuNum8Gz_M",
      "AIzaSyB2CXqQxOfeLPXjB22dYZlcpTAY20kjK0c",
      "pt-PT"
    )
    googleSpreadsheetI18nAngular.getLanguage("pt-PT")
    googleSpreadsheetI18nAngular.getLanguage("en-EN")

    $scope.i18n = googleSpreadsheetI18nAngular

  });