/**
 * Created by user on 6/1/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').directive('cascadeTreeSearchBox', cascadeTreeSearchBox);

    /*@ngInject*/
    function cascadeTreeSearchBox($timeout, $q, $log) {

        var directive = {
            replace: false,
            restrict: 'EA',
            controller: CascadeTreeSearchBoxController,
            // templateUrl: 'searchbox.tmpl.html',
            template:'<div layout-align="start center" layout="row" layout-fill> <div flex-offset="5"> <md-autocomplete style="margin-top: 20px" ng-disabled="vm.isDisabled" md-no-cache="vm.noCache" md-selected-item="vm.selectedItem" md-search-text-change="vm.searchTextChange(vm.searchText)" md-search-text="vm.searchText" md-selected-item-change="vm.selectedItemChange(item)" md-items="item in vm.querySearch(vm.searchText)" md-item-text="item.display" md-min-length="0" placeholder="Search People"> <md-item-template> <span md-highlight-text="ctrl.searchText" md-highlight-flags="^i">{{item.display}}</span> </md-item-template> <md-not-found> No states matching "{{ctrl.searchText}}" were found. <a ng-click="ctrl.newState(ctrl.searchText)">Create a new one!</a> </md-not-found> </md-autocomplete> </div></div>',
            controllerAs: 'vm',
            scope: {},
            bindToController: {},
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
            vm.states = loadAll();
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
                var results = query ? vm.states.filter(createFilterFor(query)) : vm.states,
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
                    treeViewService.setSearchedNode(item.value);
                }

            }

            /**
             * Build `states` list of key/value pairs
             */
            function loadAll() {
                var autoCompleteList = [
                    {
                        value: {
                            "name": "PublisherNameLongName",
                            "id": "id1",
                            "type": "type0",
                            "addable": false,
                            "editable": false,
                            "removable": false,
                            "enableble": false
                        },
                        display: "PublisherNameLongName",
                        displayLowerCase: "PublisherNameLongName".toLowerCase()

                    }, {
                        value: {
                            "name": "Landing A",
                            "id": "id2",
                            "type": "type1",
                            "addable": true,
                            "editable": true,
                            "removable": true,
                            "enablable": true,
                            "enable": false
                        },
                        display: "Landing A",
                        displayLowerCase: "Landing A".toLowerCase()
                    }, {
                        value: {
                            "name": "Account 1",
                            "id": "id3",
                            "type": "type2"},
                        display: "Account 1",
                        displayLowerCase: "Account 1".toLowerCase()
                    }, {
                        value: {
                            "name": "Landing B",
                            "id": "id8",
                            "type": "type1"},
                        display: "Landing B",
                        displayLowerCase: "Landing B".toLowerCase()
                    }

                ];
                var treedata = {
                    "name": "PublisherNameLongName",
                    "id": "id1",
                    "type": "type0",
                    "addable": false,
                    "editable": false,
                    "removable": false,
                    "enableble": false,
                    "children": [{
                        "name": "Landing A",
                        "id": "id2",
                        "type": "type1",
                        "addable": true,
                        "editable": true,
                        "removable": true,
                        "enablable": true,
                        "enable": false,
                        "children": [{
                            "name": "Account 1",
                            "id": "id3",
                            "type": "type2",
                            "children": [{
                                "name": "tracking link 1",
                                "id": "id4",
                                "type": "type3",
                                "enablable": true,
                                "enable": true
                            }, {
                                "name": "tracking link 2",
                                "id": "id5",
                                "type": "type3",
                                "enablable": true,
                                "enable": true
                            }, {
                                "name": "tracking link 3",
                                "id": "id6",
                                "type": "type3",
                                "enablable": true,
                                "enable": false
                            }]
                        }, {
                            "name": "Account 2",
                            "id": "id7",
                            "type": "type2"
                        }, {
                            "name": "Account 3",
                            "id": "id9",
                            "type": "type2"
                        }]
                    }, {
                        "name": "Landing B",
                        "id": "id8",
                        "type": "type1",
                        "children": [{
                            "name": "Account 4",
                            "id": "id10",
                            "type": "type2"
                        }, {
                            "name": "Account 5",
                            "id": "id11",
                            "type": "type2"
                        }, {
                            "name": "Account 6",
                            "id": "id12",
                            "type": "type2"
                        }]
                    }, {
                        "name": "Landing C",
                        "id": "id13",
                        "type": "type1",
                        "children": [{
                            "name": "Subtopic 7",
                            "id": "id14",
                            "type": "type3"
                        }, {
                            "name": "Subtopic 8",
                            "id": "id15",
                            "type": "type3"
                        }, {
                            "name": "Subtopic 9",
                            "id": "id16",
                            "type": "type3"
                        }]
                    }]
                };

                /*                var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                 Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                 Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                 Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                 North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                 South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                 Wisconsin, Wyoming';

                 return allStates.split(/, +/g).map( function (state) {
                 return {
                 value: state.toLowerCase(),
                 display: state
                 };
                 });*/

                /*                return treedata.children.map(function (node) {
                 return {
                 value: node,
                 display: node.name,
                 displayLowerCase: node.name.toLowerCase()
                 };
                 });*/

                // return extractNodes(treedata.children);
                return autoCompleteList;
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
                    return (state.displayLowerCase.indexOf(lowercaseQuery) === 0);
                };

            }

        }
    }


})();
