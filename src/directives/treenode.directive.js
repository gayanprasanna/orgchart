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
            templateUrl: 'treenode.tmpl.html',
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
