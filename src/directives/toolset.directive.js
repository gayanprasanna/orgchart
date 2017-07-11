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
            templateUrl: 'toolset.tmpl.html',
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
