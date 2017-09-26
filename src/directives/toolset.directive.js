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
            template: '<div layout="column" layout-align="center end">' +
            ' <div layout="column" layout-align="space-around center" class="toolset-wrapper" flex-offset="5">' +
            ' <div> <button class="toolset-btn upper-rounded" ng-click="vm.zoomTrigger(\'increment\')"> <md-tooltip md-direction="bottom">Zoom In</md-tooltip> <md-icon><i ng-class="{\'fa fa-plus\':true,\'custom-font-icon\':true}"></i></md-icon></button> </div>' +
            '<div> <button class="toolset-btn lower-rounded" ng-click="vm.zoomTrigger(\'decrement\')"> <md-tooltip md-direction="bottom">Zoom Out</md-tooltip> <md-icon><i ng-class="{\'fa fa-minus\':true,\'custom-font-icon\':true}"></i></md-icon></button> </div>' +
            '<div style="margin-top: 10px"> <button class="toolset-btn" ng-click="vm.toggleExpandAllMode()"> <md-tooltip md-direction="bottom"><span ng-if="!vm.isExpandAllMode">Expand All</span><span ng-if="vm.isExpandAllMode">Collapse All</span></md-tooltip> <md-icon><i ng-class="{\'fa fa-expand\':!vm.isExpandAllMode,\'fa fa-compress\':vm.isExpandAllMode,\'custom-font-icon\':true}"></i> </md-icon></button> </div>' +
            '</div></div>',
            scope: {},
            bindToController: {
                zoomTriggerCallBack: '&'
            },
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
        vm.zoomTrigger = zoomTrigger;
/*        vm.incrementZoomScale = incrementZoomScale;
        vm.decrementZoomScale = decrementZoomScale;*/
        vm.zoomScale = toolSetService.getZoomScale();

        function toggleExpandAllMode() {
            vm.isExpandAllMode = toolSetService.toggleExpandAllMode();
        };

        function zoomTrigger(status) {
            vm.zoomTriggerCallBack({status:status});
        }

/*        function incrementZoomScale() {
            vm.zoomScale = toolSetService.incrementZoomScale();
        }

        function decrementZoomScale() {
            vm.zoomScale = toolSetService.decrementZoomScale();
        }*/
    }

})();
