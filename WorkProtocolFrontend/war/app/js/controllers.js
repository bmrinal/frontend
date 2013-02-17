'use strict';

/* Controllers */


function VendorListCtrl($scope, $http) {
	 $http.jsonp('http://work0protocol.appspot.com/resources/vendors/list?callback=JSON_CALLBACK').success(function(data) {
		 $scope.vendors = data.vendors;
	 });
}

function CategoryListCtrl($scope, $http) {
	$http.jsonp('http://work0protocol.appspot.com/resources/categories/list?callback=JSON_CALLBACK').success(function(data) {
		 $scope.categories = data.category;
	 });
}