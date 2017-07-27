/**
 * Created by user on 6/5/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').directive('treeToolSet', treeToolSet);

    /*@ngInject*/
    function treeToolSet() {

        var directive = {
            replace: false,
            restrict: 'EA',
            controller: TreeToolSet,
            controllerAs: 'vm',
            // templateUrl: 'toolset.tmpl.html',
            template:'<div layout="column" layout-align="center end"> <div layout="column" layout-align="space-around center" class="toolset-wrapper" flex-offset="5"> <div> <button class="toolset-btn upper-rounded" ng-click="vm.incrementZoomScale()"> <md-tooltip md-direction="bottom">Zoom In</md-tooltip> <md-icon md-font-icon="zmdi zmdi-plus"></md-icon></button> </div><div> <button class="toolset-btn lower-rounded" ng-click="vm.decrementZoomScale()" ng-disabled="vm.zoomScale<=1"> <md-tooltip md-direction="bottom">Zoom Out</md-tooltip> <md-icon md-font-icon="zmdi zmdi-minus"></md-icon></button> </div><div style="margin-top: 10px"> <button class="toolset-btn" ng-hide="vm.isExpandAllMode" ng-click="vm.toggleExpandAllMode()"> <md-tooltip md-direction="bottom">Expand All</md-tooltip> <md-icon md-font-icon="fa fa-expand"></md-icon></button> </div><div> <button class="toolset-btn" ng-show="vm.isExpandAllMode" ng-click="vm.toggleExpandAllMode()"> <md-tooltip md-direction="bottom">Collapse All</md-tooltip> <md-icon md-font-icon="fa fa-compress"></md-icon></button> </div></div></div>',
            scope: {},
            bindToController: {},
            link: link
        };

        return directive;

        function link(scope, elem, attr, vm) {

        }
    }

    /*@ngInject*/
    function TreeToolSet(toolSetService) {
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
