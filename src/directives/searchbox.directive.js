/**
 * Created by user on 6/1/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').directive('treeSearchBox', treeSearchBox);

    /*@ngInject*/
    function treeSearchBox($timeout, $q, $log) {

        var directive = {
            replace: false,
            restrict: 'EA',
            controller: CascadeTreeSearchBoxController,
            // templateUrl: 'searchbox.tmpl.html',
            template:'<div layout-align="start center" layout="row" layout-fill> <div flex-offset="5" class="search-box-holder"> <md-autocomplete ng-disabled="vm.isDisabled" md-no-cache="vm.noCache" md-selected-item="vm.selectedItem" md-search-text-change="vm.searchTextChange(vm.searchText)" md-search-text="vm.searchText" md-selected-item-change="vm.selectedItemChange(item)" md-items="item in vm.querySearch(vm.searchText)" md-item-text="item.name" md-min-length="0" placeholder="Search People" class="auto-complete-custom"> <md-item-template> <span md-highlight-text="ctrl.searchText" md-highlight-flags="^i">{{item.name}}</span> </md-item-template> <md-not-found> No states matching "{{ctrl.searchText}}" were found. <a ng-click="ctrl.newState(ctrl.searchText)">Create a new one!</a> </md-not-found> </md-autocomplete> </div><div flex class="btn-search-holder"><button class="btn-search" type="button"><i class="fa fa-search"></i> </button></div></div>',
            // template:'<div layout-align="start center" layout="row" layout-fill> <div flex-offset="5" flex="60"> <div class="search-group active"> <div> <input id="search_txt" name="search_txt" type="text" onkeyup="viewEmployee(1);" placeholder="Search"> <button class="btn-search" type="button" onclick="viewEmployee(1);"></button> </div><a class="advace" href="#">Advance</a> </div> </div></div>',
            controllerAs: 'vm',
            scope: {},
            bindToController: {
                searchableList:'='
            },
            link: link
        };

        return directive;
        function link() {

        }

        /*@ngInject*/
        function CascadeTreeSearchBoxController(treeViewService) {

            var vm = this;
            vm.simulateQuery = false;
            vm.isDisabled = false;
            vm.noCache = true;

            // list of `state` value/display objects
            vm.querySearch = querySearch;
            vm.selectedItemChange = selectedItemChange;
            vm.searchTextChange = searchTextChange;

            vm.newState = newState;

            function newState(state) {
                alert("Sorry! You'll need to create a Constitution for " + state + " first!");
            }

            // ******************************
            // Internal methods
            // ******************************

            /**
             * Search for states... use $timeout to simulate
             * remote dataservice call.
             */
            function querySearch(query) {
                console.log(vm.searchableList);
                var results = query ? vm.searchableList.filter(createFilterFor(query)) : vm.searchableList,
                    deferred;
                if (vm.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function () {
                        deferred.resolve(results);
                    }, Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            }

            function searchTextChange(text) {
                $log.info('Text changed to ' + text);
            }

            function selectedItemChange(item) {

                if(item){
                    $log.info('Item changed to ' + JSON.stringify(item));
                    treeViewService.setSearchedNode(item);
                }

            }



            function extractNodes(listOfNodes) {

                return listOfNodes.map(function (node) {
                    return {
                        value: node,
                        display: node.name,
                        displayLowerCase: node.name.toLowerCase()
                    };
                });
            }

            /**
             * Create filter function for a query string
             */
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(state) {
                    return (state.name.toLowerCase().indexOf(lowercaseQuery) === 0);
                };

            }

        }
    }


})();
