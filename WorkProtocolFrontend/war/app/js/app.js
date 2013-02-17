'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/vendor', {templateUrl: 'app/partials/vendor.html', controller: VendorListCtrl});
    $routeProvider.when('/category', {templateUrl: 'app/partials/category.html', controller: CategoryListCtrl});
    $routeProvider.otherwise({redirectTo: '/vendor'});
  }]);