var module = angular.module('myApp', []);

module.directive('chosen', ['$timeout', '$compile', '$parse', function ($timeout, $compile, $parse) {
	return {
            restrict: 'A',
            require: 'select',
            link: function ($scope, element, attrs, controllers) {

                var initialized = false;

                $timeout(function () {
                    var options = {};
                    if (attrs.chosen) {
                        options = angular.fromJson(attrs.chosen);
                    }
                    initialized = true;
                    element.chosen(options);
                }, 0);

                var refreshChosen = function () {
                    if (!initialized) return;
                    $timeout(function () {
                        element.trigger("chosen:updated");
                    }, 0);
                };

                if (attrs.ngModel) {
                    $scope.$watch(attrs.ngModel, refreshChosen);
                }

                if (attrs.ngOptions) {
                    var list = attrs.ngOptions.match(/ in ([^ ]*)/)[1];
                    // watch for model change
                    $scope.$watch(list, refreshChosen);
                }

                if (attrs.ngDisabled) {
                    $scope.$watch(attrs.ngDisabled, refreshChosen);
                }
            }
        };
}]);

module.controller('RecipientsController', function($scope, $http) {
    $scope.url = 'recipients.json';
    $scope.recipients = [];
    $scope.selectedRecipients = [2,4,6,8]; // DUMMY DATA
    $scope.recipientsList = [];

    var selectRecipients = function() {
        $scope.recipients = _.filter($scope.recipientsList, function(item) {
            return _.contains($scope.selectedRecipients, item.id);
        });
    }

    $scope.fetchRecipients = function() {
        $http.get($scope.url).then(function(result){
            $scope.recipientsList = result.data;
            selectRecipients();
        });
    }

    $scope.fetchRecipients();
});
