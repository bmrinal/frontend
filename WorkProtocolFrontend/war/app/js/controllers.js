'use strict';

/* Controllers */

function navCtrl($scope, $location) {
    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'categories';
        return currentRoute.indexOf(page) === 0 ? 'active' : '';
    };
}

function ServiceListCtrl($scope, $http, $routeParams) {
	$scope.isViewLoading = true;
	$scope.categoryId = $routeParams.categoryId;

	if ($scope.categoryId) {
		$http.jsonp("http://work0protocol.appspot.com/resources/categories/" + $scope.categoryId + "?callback=JSON_CALLBACK").success(function(data) {
			$scope.isViewLoading = false;
			$scope.services = data.services;
		});

	} else {
		$http.jsonp('http://work0protocol.appspot.com/resources/services/list?callback=JSON_CALLBACK').success(function(data) {
			$scope.isViewLoading = false;
			$scope.services = data.service;

			$scope.$on('$viewContentLoaded', function () {
				var $container = $('.service-wrap');
	//			$container.imagesLoaded(function(){
				  $container.masonry({
				    itemSelector : '.service',
				    columnWidth : 240
				  });
	//			});
			});
		});
	}
}

function CategoryListCtrl($scope, $http) {
	$scope.isViewLoading = true;
	$http.jsonp('http://work0protocol.appspot.com/resources/categories/list?callback=JSON_CALLBACK').success(function(data) {
		$scope.isViewLoading = false;
		$scope.categories = data.category;
	 });
}