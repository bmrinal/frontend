'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/categories', {templateUrl: 'app/partials/categories.html', controller: CategoryListCtrl});
    $routeProvider.when('/services/:categoryId', {templateUrl: 'app/partials/services.html', controller: ServiceListCtrl});
    $routeProvider.when('/services', {templateUrl: 'app/partials/services.html', controller: ServiceListCtrl});
    $routeProvider.otherwise({redirectTo: '/categories'});
}]);
