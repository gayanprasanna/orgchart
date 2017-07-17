/**
 * Created by user on 5/31/17.
 */
(function () {
    'use strict';
    angular.module('orgChart').directive('cascadeTreeNode', cascadeTreeNode);

    /*@ngInject*/
    function cascadeTreeNode(treeViewService, $timeout, $document,$rootScope) {

        var cascadeTreeNodeDirective = {
            restrict: 'E',
            replace: false,
            // require:'^cascadeTreeView',
            controller: CascadeTreeNodeController,
            // templateUrl: 'treenode.tmpl.html',
            template: '<div ng-class="{\'active-node\':vm.isActive}" class="{{vm.nodeClass}}" ng-mouseenter="vm.whenMouseEnter()" ng-mouseleave="vm.whenMouseLeave()" ng-click="vm.makeNodeActive()"> <div layout="column" layout-align="center center"> <div class="md-subhead">Some Text</div><div> <div class=""><img ng-src="assets/images/avatars/flasher.thumb.jpg" class="round-chip"></div></div><div class="md-subhead">{{vm.node.name}}</div><div layout-align="center center" layout-fill class="action-area" layout="row" ng-show="vm.isExpandedView"> <div ng-repeat="action in vm.nodeActions"><button ng-click="vm.makeCallBack(action.callBack)"><span ng-bind="action.name"></span>&nbsp;<i class="{{action.icon}}"></i></button></div></div></div></div>',
            controllerAs: 'vm',
            scope: {},
            bindToController: {
                nodeId: '@',
                nodeActions: '@'
            },
            link: link
        };

        return cascadeTreeNodeDirective;


        function link(scope, elem, attrs, vm) {
            vm.id = attrs.nodeid;
            vm.nodeActions = angular.fromJson(attrs.nodeactions);
            console.log(vm.nodeActions);
            vm.isPinnedNode = false;
            vm.node = treeViewService.findById(attrs.nodeid);
            vm.nodeClass = 'node-label node-' + vm.node.type+ ' node-'+vm.id;

            // vm.isPinnedNode = true;
            vm.isExpandedView = false;
            vm.isActive = false;

            vm.whenMouseEnter = whenMouseEnter;
            vm.whenMouseLeave = whenMouseLeave;
            vm.togglePinnedMode = togglePinnedMode;
            vm.makeCallBack = makeCallBack;
            vm.makeNodeActive = makeNodeActive;
            var nodeDOMElement = angular.element(elem.children()[0]);
            /*            elem.on('click',function(){
             elem.addClass('active-node');
             });*/

            function makeNodeActive() {
                clearAllOtherActiveNodes();
                vm.isActive = true;
            }

            function whenMouseEnter() {
                console.log('mouse Entered');
                vm.isExpandedView = true;
                // vm.isPinnedNode = true;
            }

            function whenMouseLeave() {
                console.log('mouse leaved');
                vm.isExpandedView = false;
                /*            $timeout(function(){
                 vm.isPinnedNode = false;
                 },1000);*/
            }

            function togglePinnedMode() {
                vm.isPinnedNode = true;
                console.log(vm.isPinnedNode);
            }

            function makeCallBack(callBackFuncName) {
                console.log(callBackFuncName);
                scope.$parent.vm.makeCallBack(callBackFuncName);
            }

            function clearAllOtherActiveNodes(){
/*                elem.find('.node-label');//TODO
                elem.parent.getElementsByClassName('active-node');*/
                $rootScope.$broadcast('app:nodes:clearactive',{'data': ''});
            }

            function findRelevantNode(klass){
                elem.find('.tree-holder');//TODO
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


            $document.on('click', onDocumentClick);
            scope.$on('$destroy', onDestroy);

        }
    }

    /*@ngInject*/
    function CascadeTreeNodeController(treeViewService) {
        var vm = this;
        /*        vm.node = treeViewService.findById(vm.nodeId);
         vm.nodeClass = 'node-label node-'+vm.node.type;*/

    }
})();
