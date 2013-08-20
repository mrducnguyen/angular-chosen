var module = angular.module('myApp', []);

module.directive('chosen', ['$timeout', '$compile', function ($timeout, $compile) {
    var startWithNg = function (item) {
    	if (typeof item == 'string') {
    		return item.indexOf('ng-') === 0;
    	}
    	return false;
    };
    var copyNgClass = function (chosenContainer, element) {
    	if (!chosenContainer) return;
    	var containerClassNames = chosenContainer.attr('class').split(/\s+/);
    
    	chosenContainer.removeClass(containerClassNames.filter(startWithNg).join(" "));
    	chosenContainer.addClass(element.attr('class')); // copy all class from element to the chosen container
    }
    return {
    	restrict: 'A',
    	require: '?ngModel',
    	link: function ($scope, element, attrs, ngModelCtrl) {
    			console.log('chosen enhanced');
    			var chosenContainer;
    			if (ngModelCtrl) {
    				$scope.$watch(function () { return ngModelCtrl.$valid; }, function () {
    					copyNgClass(chosenContainer, element);
    				});
    			}
    
    			if (attrs.ngOptions) {
    				var trackPos;
    				var list = attrs.ngOptions.slice(attrs.ngOptions.indexOf(' in ') + 4, (trackPos = attrs.ngOptions.indexOf(' track ')) > -1 ? trackPos : attrs.ngOptions.length);
    				// watch for model change
    				$scope.$watch(list, function () {
    					console.log('chosen updated by list change');
    					element.trigger("chosen:updated");
    				}, true);
    			}
    
    			$timeout(function () {
    				var options = {};
    				if (attrs.chosen) {
    					options = $parse(attrs.chosen);
    				}
    				element.chosen(options);
    				$timeout(function () {
    					chosenContainer = element.next();
    					copyNgClass(chosenContainer, element);
					if (attrs.ngDisabled)
					{
						// var attrKey = key.toLowerCase();
						// attrKey = attrKey.substring(0, 2) + '-' + attrKey.substring(2);
						chosenContainer.attr('ng-disabled', attrs[key]);
						//chosenContainer.find('input').attr('ng-disabled', tAttrs[key]);
					}
    					chosenContainer = $compile(chosenContainer)($scope);
    				}, 0);
    			}, 0);
    		};
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
