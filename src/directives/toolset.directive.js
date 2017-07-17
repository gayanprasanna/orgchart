/**
 * Created by user on 6/5/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').directive('cascadeToolSet', cascadeToolSet);

    /*@ngInject*/
    function cascadeToolSet() {

        var directive = {
            replace: false,
            restrict: 'EA',
            controller: cascadeToolSetController,
            controllerAs: 'vm',
            // templateUrl: 'toolset.tmpl.html',
            template:'<div layout="column" layout-align="center end"> <div layout="row" layout-align="space-around center" style="margin-top: 20px" flex-offset="5"> <div> <md-button class="md-icon-button" ng-click="vm.incrementZoomScale()"> <md-tooltip md-direction="bottom">Zoom In</md-tooltip> <md-icon md-font-icon="zmdi zmdi-plus"></md-icon></md-button> </div><div> <md-button class="md-icon-button" ng-click="vm.decrementZoomScale()" ng-disabled="vm.zoomScale<=1"> <md-tooltip md-direction="bottom">Zoom Out</md-tooltip> <md-icon md-font-icon="zmdi zmdi-minus"></md-icon></md-button> </div><div> <md-button class="md-icon-button" ng-hide="vm.isExpandAllMode" ng-click="vm.toggleExpandAllMode()"> <md-tooltip md-direction="bottom">Expand All</md-tooltip> <md-icon md-font-icon="zmdi zmdi-triangle-down"></md-icon></md-button> </div><div> <md-button class="md-icon-button" ng-show="vm.isExpandAllMode" ng-click="vm.toggleExpandAllMode()"> <md-tooltip md-direction="bottom">Collapse All</md-tooltip> <md-icon md-font-icon="zmdi zmdi-triangle-up"></md-icon></md-button> </div></div></div>',
            scope: {},
            bindToController: {},
            link: link
        };

        return directive;

        function link(scope, elem, attr, vm) {

        }
    }

    /*@ngInject*/
    function cascadeToolSetController(toolSetService) {
        var vm = this;

        vm.isExpandAllMode = toolSetService.isExpandAllMode();
        vm.toggleExpandAllMode = toggleExpandAllMode;
        vm.incrementZoomScale = incrementZoomScale;
        vm.decrementZoomScale = decrementZoomScale;
        vm.zoomScale = toolSetService.getZoomScale();

        function toggleExpandAllMode() {
            vm.isExpandAllMode = toolSetService.toggleExpandAllMode();
        };

        function incrementZoomScale() {
            vm.zoomScale = toolSetService.incrementZoomScale();
        }

        function decrementZoomScale() {
            vm.zoomScale = toolSetService.decrementZoomScale();
        }
    }

})();
