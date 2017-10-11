/**
 * Created by user on 5/31/17.
 */
(function () {
    'use strict';
    angular.module('orgChart').directive('treeNode', treeNode);

    /*@ngInject*/
    function treeNode(treeViewService, $document,$rootScope) {

        var cascadeTreeNodeDirective = {
            restrict: 'E',
            replace: true,
            templateNamespace:'svg',
            controller: CascadeTreeNodeController,
            // templateUrl: 'app/cascade/test/orgchart/directives/treenode.tmpl.html',
            template: '<foreignObject width="260" height="220" style="overflow: visible"><div style="margin-top: 50px;margin-left:10px" class="{{vm.nodeClass}}" ng-mouseenter="vm.whenMouseEnter()" ng-mouseleave="vm.whenMouseLeave()" ng-click="vm.makeNodeActive()"> <div layout="column" layout-align="center center"> <div ng-class="{\'node-text-main-no-image\':!vm.isImagePresent}" class="md-subhead node-text-main"><trim-word word-options ="vm.wordTrimOptions" word="vm.node.name"></trim-word></div><div> <div class="round-chip-wrapper"><img ng-if="vm.isImagePresent" ng-src="{{vm.node.image_url}}" class="round-chip" id="img-chip"> </div></div><div  ng-class="{\'node-text-sub-no-image\':!vm.isImagePresent}" class="md-subhead node-text-sub">{{vm.node.name}}</div><div layout-align="center center" layout-fill layout="row"> <div ng-repeat="action in vm.nodeActions"> <button ng-click="vm.makeCallBack(action.callBack); $event.stopPropagation();" class="action-btn"><span></span>&nbsp;<i class="{{action.icon}}"></i></button> </div></div></div></div></foreignObject>',
            controllerAs: 'vm',
            scope: {},
            bindToController: {
                nodeId: '@',
                nodeActions: '@',
                active:'='
            },
            link: {
                pre:link
            }
        };

        return cascadeTreeNodeDirective;


        function link(scope, elem, attrs, vm) {
            console.log(attrs.imagepresent);
            vm.isImagePresent = attrs.imagepresent=='true'?true:false;
            vm.id = attrs.nodeid;
            vm.nodeActions = angular.fromJson(attrs.nodeactions);
            console.log(vm.nodeActions);
            vm.isPinnedNode = false;
            vm.node = treeViewService.findById(attrs.nodeid);
            vm.wordTrimOptions = {
                word: 'd',
                from: '0',
                until: '12',
                toolTip: 'true',
                toolTipDirection: 'top'
            };
            vm.nodeClass = 'node-label node-' + vm.node.type+ ' node-'+vm.id;
            vm.isExpandedView = false;
            vm.isActive = false;

            vm.whenMouseEnter = whenMouseEnter;
            vm.whenMouseLeave = whenMouseLeave;
            vm.togglePinnedMode = togglePinnedMode;
            vm.makeCallBack = makeCallBack;
            vm.makeNodeActive = makeNodeActive;
            var nodeDOMElement = angular.element(elem.children()[0]);

            $document.on('click', onDocumentClick);
            scope.$on('$destroy', onDestroy);

            function makeNodeActive() {
                clearAllOtherActiveNodes();
                vm.isActive = true;
            }

            function whenMouseEnter() {
                console.log('mouse Entered');
            }

            function whenMouseLeave() {
                console.log('mouse leaved');
            }

            function togglePinnedMode() {
                vm.isPinnedNode = true;
                console.log(vm.isPinnedNode);
            }

            function makeCallBack(callBackFuncName) {
                console.log(callBackFuncName);
                scope.$parent.vm.makeCallBack(callBackFuncName,vm.node);
            }

            function clearAllOtherActiveNodes(){
                $rootScope.$broadcast('app:nodes:clearactive',{'data': ''});
            }

            function onDocumentClick(ev) {

                //Check if clicked outside and discard Active
                if (elem !== ev.target && !elem[0].contains(ev.target)) {
                    scope.$apply(function () {
                        vm.isActive = false;
                    });
                }
            }

            //remove event handlers when custom directive destroyed
            function onDestroy() {
                $document.off('click', onDocumentClick);
            }


        }
    }

    /*@ngInject*/
    function CascadeTreeNodeController() {
        var vm = this;
    }
})();
