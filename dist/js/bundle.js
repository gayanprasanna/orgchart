/**
 * Created by user on 7/10/17.
 */
(function () {
    'use strict';
    angular.module('orgChart',[]);
})();
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
            templateUrl: 'app/cascade/test/orgchart/directives/searchbox.tmpl.html',
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
            templateUrl: 'app/cascade/test/orgchart/directives/toolset.tmpl.html',
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

/**
 * Created by user on 6/5/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').factory('toolSetService', toolSetService);

    /*@ngInject*/
    function toolSetService() {

        var isAllExpandedMode = false;
        const LOWEST_ZOOM_SCALE = 1;
        var zoomScale = LOWEST_ZOOM_SCALE;

        return {
            isExpandAllMode: isExpandAllMode,
            toggleExpandAllMode: toggleExpandAllMode,
            getZoomScale: getZoomScale,
            setZoomScale: setZoomScale,
            incrementZoomScale: incrementZoomScale,
            decrementZoomScale: decrementZoomScale
        };

        function isExpandAllMode() {
            return isAllExpandedMode;
        }

        function toggleExpandAllMode() {
            isAllExpandedMode = !isAllExpandedMode;
            return isAllExpandedMode;
        }

        function getZoomScale() {
            return zoomScale;
        }

        function setZoomScale(scale) {
            if (scale > 1) {
                // zoomScale = scale;
            } else {
                // zoomScale = LOWEST_ZOOM_SCALE + scale;
            }
            zoomScale = scale;
            console.log('zoom scale', zoomScale);
        }

        function incrementZoomScale() {
            zoomScale += 0.1;

            return zoomScale;
        }

        function decrementZoomScale() {
            if (zoomScale > 1) {
                zoomScale -= 0.1;
            }

            return zoomScale;
        }
    }
})();

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
            templateUrl: 'app/cascade/test/orgchart/directives/treenode.tmpl.html',
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

/**
 * Created by user on 5/30/17.
 */
(function () {
    'use strict';
    angular.module('orgChart').directive('cascadeTreeView', cascadeTreeView);

    /*@ngInject*/
    function cascadeTreeView($filter, $compile, treeViewService, $timeout, toolSetService, $window) {
        var treeViewDirective = {
            replace: 'false',
            restrict: 'E',
            scope: {},
            bindToController: {
                data: '=',
                abn: '&',
                nodeActions: '@'
            },
            controller: TreeViewDirectiveController,
            controllerAs: 'vm',
            link: link
        };

        function link(scope, elem, attrs, vm) {
            //TODO Fetch From the db and add to the service
            var treedata = {
                "name": "RootNode",
                "id": "id1",
                "type": "type0",
                "addable": false,
                "editable": false,
                "removable": false,
                "enableble": false,
                "root":true,
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

            var nodeActiveClearListener;
            var nodeList = [];
            var m = [20, 20, 20, 20],
                w = $window.innerWidth - 20 - m[1] - m[3],
                h = 600 - m[0] - m[2],
                i = 0,
                r = 800,
                x = d3.scale.linear().domain([0, w]).range([0, w]),
                y = d3.scale.linear().domain([0, h]).range([0, h]),
                root;

            var wrapperElement = d3.select(elem[0]);
            var lastSearchedPath = [];
            elem.append($compile("<div layout=\"row\" layout-align=\"space-around center\"><div flex><cascade-tree-search-box></cascade-tree-search-box></div><div flex><cascade-tool-set></cascade-tool-set></div></div>")(scope));

            function onInit() {
                activateWatchers();
            }


            function activateWatchers() {
                onSearchWatch();
                onZoomWatch();
                onExpandWatch();
            }

            function onExpandWatch() {
                scope.$watch(function () {
                    return toolSetService.isExpandAllMode()
                }, function (isInExpandAllMode) {
                    if (isInExpandAllMode) {
                        expandAll();
                    } else {
                        collapseAll();
                    }
                })
            }

            function onSearchWatch() {
                scope.$watch(function () {
                    return treeViewService.getSearchedNode();
                }, function (node) {
                    console.log(node);
                    if (node) {
                        //First find and highlight the path
                        highlightPath(node);
                        var resolvedNode = getTreeNodeByObject(node);

                        reset();
                        //TODO remove later coz expanding occurs when highlighting
                        /*                        expandNode(resolvedNode);
                         update(resolvedNode);*/

                        $timeout(function () {
                            console.log(resolvedNode.x, resolvedNode.y);
                            clearAllActiveNodes();
                            makeNodeActive(resolvedNode.id);
                            panToTheNode(resolvedNode);
                        }, 500);

                    }
                });
            }

            function onZoomWatch() {
                scope.$watch(function () {
                    return toolSetService.getZoomScale();
                }, function (zoomScale) {
                    console.log(zoomScale);
                    vis.transition()
                        .duration(750)
                        .call(zoomObject.translate([150, 100]).scale(zoomScale).scaleExtent([1, 8]).event);
                });

            }

            onInit();

            var vis = wrapperElement.append("div").attr("layout", "row").attr("layout-align", "space-around center")
                .call(function () {
                    $compile(this[0])(scope);
                })
                .append("div").attr("flex", "").call(function () {
                    $compile(this[0])(scope);
                })
                .append("svg:svg")
                .attr("viewBox", "0 0 600 600")
                .attr("width", w + m[1] + m[3])
                .attr("height", h + m[0] + m[2])
                .append("svg:g")
                //.attr("pointer-events", "all")
                .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
                //.call(d3.behavior.zoom().scaleExtent([1,8]).on("zoom",zoom));
                //.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on
                .call(d3.behavior.zoom().on("zoom", function () {
                    toolSetService.setZoomScale(d3.event.scale);
                    scope.$apply();
                    console.log(d3.event.scale);
                    // vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                    vis.attr("transform", "translate(" + d3.event.translate + ")");
                })).on("click", stopPropogation, false).call(d3.behavior.drag().on("dragstart", function () {
                    d3.event.sourceEvent.stopPropagation();
                }).on("drag", function () {
                    console.log("dragged");
                    d3.event.sourceEvent.stopPropagation();
                })).append("g").attr("width", 160).attr("height", 120).attr("class", "tree-holder")/*.call(d3.behavior.drag().on("dragstart", function () {
             d3.event.sourceEvent.stopPropagation();
             }).on("drag", function () {
             console.log("dragged");
             }))*/;

            //TODO uncomment later
            /*            vis.append("rect")
             // .attr("class", "overlay")
             .attr("width", w + m[1] + m[3])
             .attr("height", h + m[0] + m[2])
             .attr("opacity", 0).on("click", function () {
             stopPropogation();
             reset();
             });*/

            var tree = d3.layout.tree()
                .size([h, w])
                .nodeSize([110, 60])
                .separation(function separation(a, b) {
                    return a.parent == b.parent ? 2 : 2;
                });

            var diagonal = d3.svg.diagonal()
                .projection(function (d) {
                    return [d.x + 80, d.y + 80];
                });

            root = treedata;
            root.x0 = h / 2;
            root.y0 = 0;

            function toggleAll(d) {
                if (d.children) {
                    d.children.forEach(toggleAll);
                    toggle(d);
                }
            };

            function expandAllAfter(d) {
                var children = (d.children) ? d.children : d._children;
                if (d._children) {
                    d.children = d._children;
                    d._children = null;
                }
                if (children)
                    children.forEach(expandAllAfter);
            };

            function collapseAllAfter(d) {
                var children = (d.children) ? d.children : d._children;
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                }
                if (children)
                    children.forEach(collapseAllAfter);
            }

            function expandAll() {
                expandAllAfter(root);
                update(root);
            }

            function collapseAll() {
                collapseAllAfter(root);
                update(root);
            }

            console.log(root);

// initialize the display to show a few nodes.
            root.children.forEach(toggleAll);
//toggle(root.children[1]);
//toggle(root.children[9]);


            update(root);

            function update(source) {
                var duration = d3.event && d3.event.altKey ? 5000 : 500;

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse();

                // Normalize for fixed-depth.
                nodes.forEach(function (d) {
                    d.y = d.depth * 200;
                });

                // Update the nodes...
                var node = vis.selectAll("g.node")
                    .data(nodes, function (d) {
                        return d.id || (d.id = ++i);
                    });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("svg:g")
                    .attr("class", "node")
                    .attr("id", function (d) {
                        return "node-" + d.id;
                    })
                    .attr("transform", function (d) {
                        return "translate(" + source.x0 + "," + source.y0 + ")";
                    })
                    .on("click", function (d) {
                        if (d3.event.defaultPrevented) return;

                        toggle(d);
                        update(d);
                        if (d['info']) {
                            playvid(d['info']);
                        }
                    });

                //Adding a picture to the node circle

                nodeEnter.append("svg:circle")
                    .attr("r", 1e-6)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                var nodeText = nodeEnter
                    .append("svg:foreignObject")
                    //.attr("y", function(d) { return d.children || d._children ? -10 : 10; })
                    //.attr("dx", ".35em")
                    //.attr("x", function(d) {
                    //  return d.children || d._children ? -10 : 10;
                    //})
                    .attr("y", -30)
                    .attr("x", -5)
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .style("fill-opacity", 1e-6)
                    .attr('width', 160)
                    .attr('height', 120)
                    .append('xhtml:div')
                    /*                    .attr("class", function (d) {
                     return "node-label" + " node-" + d.type
                     }).attr("ng-show", "true").call(function () {
                     $compile(this[0].parentNode)(scope);
                     })*/
                    .classed("disabled", function (d) {
                        return d.enable !== undefined && !d.enable;
                    }).on("click", onClickedNode)/*.call(d3.behavior.drag().on("dragstart", function () {
                 d3.event.sourceEvent.stopPropagation();
                 }).on("drag", function () {
                 console.log("dragged");
                 }))*/;

                nodeText.append("cascade-tree-node").attr("nodeId", function (d) {
                    return d.id;
                }).attr("isPinnedNode", "false").attr("nodeActions", attrs.nodeactions)
                    .each(function () {
                        $compile(this)(scope);
                    });
                /*
                 .call(function () {
                 $compile(this[0].parentNode)(scope);
                 });
                 */
                /*
                 //Enable node button
                 nodeText.filter(function (d) {
                 return d.enablable;
                 })
                 .append("input", ".")
                 .attr("type", "checkbox")
                 .property("checked", function (d) {
                 return d.enable;
                 })
                 .on("change", toggleEnable, true)
                 .on("click", stopPropogation, true);

                 //Node label
                 nodeText.append("span")
                 .attr("class", "node-text")
                 .text(function (d) {
                 return d.name + ' X - ' + d.x + ', Y - ' + d.y;
                 });

                 //Edit node button
                 nodeText.filter(function (d) {
                 return d.editable;
                 })
                 .append("a")
                 .attr("class", "node-edit")
                 .on("click", onEditNode, true)
                 .append("i")
                 .attr("class", "fa fa-pencil");

                 //Add node button
                 nodeText.filter(function (d) {
                 return d.addable;
                 })
                 .append("a")
                 .attr("class", "node-add")
                 .on("click", onAddNode, true)
                 .append("i")
                 .attr("class", "fa fa-plus");

                 //Remove node button
                 nodeText.filter(function (d) {
                 return d.removable;
                 })
                 .append("a")
                 .attr("class", "node-remove")
                 .on("click", onRemoveNode, true)
                 .append("i")
                 .attr("class", "fa fa-times");*/

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });

                nodeUpdate.select("circle")
                    .attr("r", 4.5)
                    .style("fill", function (d) {
                        if (d.class === 'highlight-link') {
                            return '#ff4136';
                        } else if (d._children) {
                            return 'lightsteelblue';
                        } else {
                            return '#fff';
                        }
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting ndoes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + source.x + "," + source.y + ")";
                    })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);
                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links...
                var link = vis.selectAll("path.link")
                    .data(tree.links(nodes), function (d) {
                        return d.target.id;
                    });

                // Enter any new links at hte parent's previous position
                link.enter().insert("svg:path", "g")
                    .attr("class", "link")
                    .attr("d", function (d) {
                        var o = {
                            x: source.x0,
                            y: source.y0
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal)
                    /*                    .attr("class",function (d) {
                     return (d.target.class === "highlight-link")?"highlight-link-stroke-active":"highlight-link-stroke-inactive";
                     });*/
                    .style("stroke", function (d) {
                        if (d.target.class === "highlight-link") {
                            return "#ff4136";
                        }
                    });

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function (d) {
                        var o = {
                            x: source.x,
                            y: source.y
                        };
                        return diagonal({
                            source: o,
                            target: o
                        });
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });

                angular.copy(nodes, nodeList);

                treeViewService.setNodes(nodeList);
            }

// Toggle children
            function toggle(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
            }

            function expandNode(node) {
                node.children = node._children;
                node._children = null;
            }

// zoom in / out
            function zoom(d) {
                //vis.attr("transform", "transl3ate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                var nodes = vis.selectAll("g.node");
                nodes.attr("transform", transform);

                // Update the links...
                var link = vis.selectAll("path.link");
                link.attr("d", translate);

                // Enter any new links at hte parent's previous position
                //link.attr("d", function(d) {
                //      var o = {x: d.x0, y: d.y0};
                //      return diagonal({source: o, target: o});
                //    });
            }

            function transform(d) {
                return "translate(" + x(d.y) + "," + y(d.x) + ")";
            }

            function translate(d) {
                var sourceX = x(d.target.parent.y);
                var sourceY = y(d.target.parent.x);
                var targetX = x(d.target.y);
                var targetY = (sourceX + targetX) / 2;
                var linkTargetY = y(d.target.x0);
                var result = "M" + sourceX + "," + sourceY + " C" + targetX + "," + sourceY + " " + targetY + "," + y(d.target.x0) + " " + targetX + "," + linkTargetY + "";
                //console.log(result);

                return result;
            }


            function onEditNode(d) {
                var length = 9;
                var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
                addChildNode(d.id, {
                    "name": "new child node",
                    "id": id,
                    "type": "type2"
                });
                stopPropogation();
            }

            function onAddNode(d) {
                var length = 9;
                var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
                addChildNode(d.id, {
                    "name": "new child node",
                    "id": id,
                    "type": "type2"
                });
                stopPropogation();
            }

            function onRemoveNode(d) {
                var index = d.parent.children.indexOf(d);
                if (index > -1) {
                    d.parent.children.splice(index, 1);
                }
                update(d.parent);
                stopPropogation();
            }

            function addChildNode(parentId, newNode) {
                var node = d3.select('#' + 'node-' + parentId);
                var nodeData = node.datum();
                if (nodeData.children === undefined && nodeData._children === undefined) {
                    nodeData.children = [newNode];
                } else if (nodeData._children != null) {
                    nodeData._children.push(newNode);
                    toggle(nodeData);
                } else if (nodeData.children != null) {
                    nodeData.children.push(newNode);
                }
                update(node);
                stopPropogation();
            }

            function toggleEnable(d) {
                d.enable = !d.enable;
                var node = d3.select('#' + 'node-' + d.id + " .node-label")
                    .classed("disabled", !d.enable);
                stopPropogation();
            }


            function stopPropogation() {
                d3.event.stopPropagation();
            }

            var active = d3.select(null);

            function onClickedNode(node) {
                if (d3.event.defaultPrevented) return;
                console.log(node);
                var isReset = makeClickedNodeActive(this);

                if (isReset) {
                    return;
                }

                //TODO scale according to the bounds
                // var bounds = d3.select(elem[0]).node().getBBox();
                // var scale = Math.max(1, Math.min(8, 0.9 / Math.max(d.x , d.y )));
                panToTheNode(node);
            }

            function highlightPath(node) {
                //TODO must include the root node in the array
                //Path array to store nodes
                var path = searchWithinTree(treedata, node.name, []);

                if (angular.isDefined(path)) {
                    //function to open paths
                    clearHighLightLinks(lastSearchedPath);
                    highlightLinks(path);
                } else {
                    console.log('Searched node ' + node.name + ' not found');
                }

                lastSearchedPath = path;
            }

            function highlightLinks(path) {

                angular.forEach(path, function (value, key) {

                    //TODO assume that id of the root node is 1,.make this more consistent later
                    // if (value.id !=='id1') {
                        value.class = 'highlight-link';
                        if (value._children) {
                            value.children = value._children;
                            value._children = null;
                        }
                        update(value);
                    // }
                })
            }

            function clearHighLightLinks(path) {
                angular.forEach(path, function (value, key) {
                    value.class = '';
                    if (value._children) {
                        value.children = value._children;
                        value._children = null;
                    }
                    update(value);
                })
            }

            function removeHighlight(node) {
                if (node.class === 'highlight-link') {
                    node.class = '';
                }
                return node;
            }

            //search on tree for a link
            function searchWithinTree(node, searchKey, path) {
                if (node.name === searchKey) { //if search is found return, add the object to the path and return it
                    path.push(node);
                    return path;
                }
                else if (node.children || node._children) { //if children are collapsed d3 object will have them instantiated as _children
                    var children = (node.children) ? node.children : node._children;
                    for (var i = 0; i < children.length; i++) {
                        path.push(node);// we assume this path is the right one
                        var found = searchWithinTree(children[i], searchKey, path);
                        if (found) {// we were right, this should return the bubbled-up path from the first if statement
                            return found;
                        }
                        else {//we were wrong, remove this parent from the path and continue iterating
                            path.pop();
                        }
                    }
                }
                else {//not the right object, return false so it will continue to iterate in the loop
                    return false;
                }
            }

            function makeClickedNodeActive(elem) {
                var isReset = false;
                if (active.node() === elem) {
                    isReset = reset();
                }

                if (isReset) {
                    return true;
                } else {
                    active.classed("active", false);
                    active = d3.select(elem).classed("active", true);
                    return false;
                }

            }

            function panToTheNode(node) {
                var scale = 1;//FIXME add scale to higher if need
                var translate = [node.x / 2 - scale * node.x, node.y / 2 - scale * node.y];
                vis.transition()
                    .duration(1250)
                    .call(zoomObject.translate(translate).scale(scale).event);
            }

            /*            function calculateTranslation(node) {
             var trnaslationSet= [];
             if(node.x<300){
             300-node.x;
             }else if(node.x>300){
             node.x-300;
             }
             }*/

            var zoomObject = d3.behavior.zoom()
                .translate([0, 0])
                .scale(1)
                .scaleExtent([1, 8])
                .on("zoom", zoomedWrapper);


            function zoomedWrapper() {
                // g.style("stroke-width", 1.5 / d3.event.scale + "px");
                vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function reset() {
                console.log("reset called");
                active.classed("active", false);
                active = d3.select(null);

                vis.transition()
                    .duration(750)
                    .call(zoomObject.translate([150, 100]).scale(1).event);

                return true;
            }

            function getTreeNodeByObject(object) {
                var treeNode = $filter('filter')(nodeList, {'id': object.id}, true)[0];
                return treeNode;
            }

            /*            elem.removeAttr("cascade-tree-view");
             $compile(elem)(scope);*/

            nodeActiveClearListener = scope.$on('app:nodes:clearactive', onDeactivateNodes);

            function makeNodeActive(id) {
                var nodeList = d3.selectAll(".node-" + id.toString());
                angular.element(nodeList[0]).addClass('active-node');
            }

            function clearAllActiveNodes() {
                var nodeList = d3.selectAll(".node-label");
                angular.forEach(nodeList, function (v, k) {
                    angular.element(v).removeClass('active-node');
                });
            }

            function onDeactivateNodes(ev, data) {
                clearAllActiveNodes();
            }

            scope.$on('$destroy', destroyListener);
            function destroyListener() {
                nodeActiveClearListener;
            }
        }

        return treeViewDirective;
    }

    /*@ngInject*/
    function TreeViewDirectiveController($rootScope, $scope, treeViewService) {
        var vm = this;
        vm.makeCallBack = makeCallBack;

        function makeCallBack(identifier) {
            console.log('called treeview call back abn');
            $scope.vm[identifier]();
        }

        /*        function onInit() {
         $scope.$watch(function () {
         return treeViewService.getSearchedNode();
         }, function (node) {
         console.log(node);
         });
         }

         onInit();*/
        /*        var searchListener = $rootScope.$on('chart:hierarchy:search', onSearch);

         function onSearch(node) {
         console.log(node);
         }


         $rootScope.$on('$destroy', destroyListener);
         function destroyListener() {
         searchListener();
         }*/
    }
})();

/**
 * Created by user on 6/1/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').factory('treeViewService', treeViewService);

    function treeViewService($filter) {
        var selectedNode = null;
        var nodes = [];

        var serviceExposable = {
            setSearchedNode: setSearchedNode,
            getSearchedNode: getSearchedNode,
            setNodes: setNodes,
            getNodes: getNodes,
            findById: findById
        };

        return serviceExposable;

        function findById(id) {
            var treeNode = $filter('filter')(nodes, {'id': id},true)[0];
            return treeNode;
        }

        function setNodes(setOfnodes) {
            nodes = setOfnodes;
        }

        function getNodes() {
            return nodes;
        }

        function setSearchedNode(node) {
            selectedNode = node;
        }

        function getSearchedNode() {
            return selectedNode;
        }
    }
})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9yZ2NoYXJ0Lm1vZHVsZS5qcyIsImRpcmVjdGl2ZXMvc2VhcmNoYm94LmRpcmVjdGl2ZS5qcyIsImRpcmVjdGl2ZXMvdG9vbHNldC5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3Rvb2xzZXQuc2VydmljZS5qcyIsImRpcmVjdGl2ZXMvdHJlZW5vZGUuZGlyZWN0aXZlLmpzIiwiZGlyZWN0aXZlcy90cmVldmlldy5kaXJlY3RpdmUuanMiLCJkaXJlY3RpdmVzL3RyZWV2aWV3LnNlcnZpY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL1FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbDFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gNy8xMC8xNy5cbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ29yZ0NoYXJ0JyxbXSk7XG59KSgpOyIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDYvMS8xNy5cbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnb3JnQ2hhcnQnKS5kaXJlY3RpdmUoJ2Nhc2NhZGVUcmVlU2VhcmNoQm94JywgY2FzY2FkZVRyZWVTZWFyY2hCb3gpO1xuXG4gICAgLypAbmdJbmplY3QqL1xuICAgIGZ1bmN0aW9uIGNhc2NhZGVUcmVlU2VhcmNoQm94KCR0aW1lb3V0LCAkcSwgJGxvZykge1xuXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogQ2FzY2FkZVRyZWVTZWFyY2hCb3hDb250cm9sbGVyLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY2FzY2FkZS90ZXN0L29yZ2NoYXJ0L2RpcmVjdGl2ZXMvc2VhcmNoYm94LnRtcGwuaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXG4gICAgICAgICAgICBzY29wZToge30sXG4gICAgICAgICAgICBiaW5kVG9Db250cm9sbGVyOiB7fSxcbiAgICAgICAgICAgIGxpbms6IGxpbmtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gZGlyZWN0aXZlO1xuICAgICAgICBmdW5jdGlvbiBsaW5rKCkge1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKkBuZ0luamVjdCovXG4gICAgICAgIGZ1bmN0aW9uIENhc2NhZGVUcmVlU2VhcmNoQm94Q29udHJvbGxlcih0cmVlVmlld1NlcnZpY2UpIHtcblxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcbiAgICAgICAgICAgIHZtLnNpbXVsYXRlUXVlcnkgPSBmYWxzZTtcbiAgICAgICAgICAgIHZtLmlzRGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZtLm5vQ2FjaGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBsaXN0IG9mIGBzdGF0ZWAgdmFsdWUvZGlzcGxheSBvYmplY3RzXG4gICAgICAgICAgICB2bS5zdGF0ZXMgPSBsb2FkQWxsKCk7XG4gICAgICAgICAgICB2bS5xdWVyeVNlYXJjaCA9IHF1ZXJ5U2VhcmNoO1xuICAgICAgICAgICAgdm0uc2VsZWN0ZWRJdGVtQ2hhbmdlID0gc2VsZWN0ZWRJdGVtQ2hhbmdlO1xuICAgICAgICAgICAgdm0uc2VhcmNoVGV4dENoYW5nZSA9IHNlYXJjaFRleHRDaGFuZ2U7XG5cbiAgICAgICAgICAgIHZtLm5ld1N0YXRlID0gbmV3U3RhdGU7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG5ld1N0YXRlKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJTb3JyeSEgWW91J2xsIG5lZWQgdG8gY3JlYXRlIGEgQ29uc3RpdHV0aW9uIGZvciBcIiArIHN0YXRlICsgXCIgZmlyc3QhXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgICAgICAgIC8vIEludGVybmFsIG1ldGhvZHNcbiAgICAgICAgICAgIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAqIFNlYXJjaCBmb3Igc3RhdGVzLi4uIHVzZSAkdGltZW91dCB0byBzaW11bGF0ZVxuICAgICAgICAgICAgICogcmVtb3RlIGRhdGFzZXJ2aWNlIGNhbGwuXG4gICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGZ1bmN0aW9uIHF1ZXJ5U2VhcmNoKHF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdHMgPSBxdWVyeSA/IHZtLnN0YXRlcy5maWx0ZXIoY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSkgOiB2bS5zdGF0ZXMsXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkO1xuICAgICAgICAgICAgICAgIGlmICh2bS5zaW11bGF0ZVF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkID0gJHEuZGVmZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShyZXN1bHRzKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgTWF0aC5yYW5kb20oKSAqIDEwMDAsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBzZWFyY2hUZXh0Q2hhbmdlKHRleHQpIHtcbiAgICAgICAgICAgICAgICAkbG9nLmluZm8oJ1RleHQgY2hhbmdlZCB0byAnICsgdGV4dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHNlbGVjdGVkSXRlbUNoYW5nZShpdGVtKSB7XG5cbiAgICAgICAgICAgICAgICBpZihpdGVtKXtcbiAgICAgICAgICAgICAgICAgICAgJGxvZy5pbmZvKCdJdGVtIGNoYW5nZWQgdG8gJyArIEpTT04uc3RyaW5naWZ5KGl0ZW0pKTtcbiAgICAgICAgICAgICAgICAgICAgdHJlZVZpZXdTZXJ2aWNlLnNldFNlYXJjaGVkTm9kZShpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyoqXG4gICAgICAgICAgICAgKiBCdWlsZCBgc3RhdGVzYCBsaXN0IG9mIGtleS92YWx1ZSBwYWlyc1xuICAgICAgICAgICAgICovXG4gICAgICAgICAgICBmdW5jdGlvbiBsb2FkQWxsKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdXRvQ29tcGxldGVMaXN0ID0gW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlB1Ymxpc2hlck5hbWVMb25nTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkYWJsZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVkaXRhYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVtb3ZhYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxlYmxlXCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJQdWJsaXNoZXJOYW1lTG9uZ05hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlMb3dlckNhc2U6IFwiUHVibGlzaGVyTmFtZUxvbmdOYW1lXCIudG9Mb3dlckNhc2UoKVxuXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiTGFuZGluZyBBXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUxXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhZGRhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlZGl0YWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicmVtb3ZhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmFibGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImVuYWJsZVwiOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IFwiTGFuZGluZyBBXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5TG93ZXJDYXNlOiBcIkxhbmRpbmcgQVwiLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJBY2NvdW50IDFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTJcIn0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIkFjY291bnQgMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheUxvd2VyQ2FzZTogXCJBY2NvdW50IDFcIi50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiTGFuZGluZyBCXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkOFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUxXCJ9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogXCJMYW5kaW5nIEJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlMb3dlckNhc2U6IFwiTGFuZGluZyBCXCIudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIHZhciB0cmVlZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiUHVibGlzaGVyTmFtZUxvbmdOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhZGRhYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcImVkaXRhYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInJlbW92YWJsZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJlbmFibGVibGVcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hpbGRyZW5cIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkxhbmRpbmcgQVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWRkYWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJlZGl0YWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJyZW1vdmFibGVcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImVuYWJsZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY2hpbGRyZW5cIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJBY2NvdW50IDFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNoaWxkcmVuXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRyYWNraW5nIGxpbmsgMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQ0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxlXCI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRyYWNraW5nIGxpbmsgMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQ1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxlXCI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRyYWNraW5nIGxpbmsgM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQ2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxlXCI6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJBY2NvdW50IDJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQ3XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTJcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkFjY291bnQgM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJMYW5kaW5nIEJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUxXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNoaWxkcmVuXCI6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWNjb3VudCA0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWNjb3VudCA1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWNjb3VudCA2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJMYW5kaW5nIENcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDEzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjaGlsZHJlblwiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIlN1YnRvcGljIDdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQxNFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJTdWJ0b3BpYyA4XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlM1wiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VidG9waWMgOVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDE2XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgdmFyIGFsbFN0YXRlcyA9ICdBbGFiYW1hLCBBbGFza2EsIEFyaXpvbmEsIEFya2Fuc2FzLCBDYWxpZm9ybmlhLCBDb2xvcmFkbywgQ29ubmVjdGljdXQsIERlbGF3YXJlLFxcXG4gICAgICAgICAgICAgICAgIEZsb3JpZGEsIEdlb3JnaWEsIEhhd2FpaSwgSWRhaG8sIElsbGlub2lzLCBJbmRpYW5hLCBJb3dhLCBLYW5zYXMsIEtlbnR1Y2t5LCBMb3Vpc2lhbmEsXFxcbiAgICAgICAgICAgICAgICAgTWFpbmUsIE1hcnlsYW5kLCBNYXNzYWNodXNldHRzLCBNaWNoaWdhbiwgTWlubmVzb3RhLCBNaXNzaXNzaXBwaSwgTWlzc291cmksIE1vbnRhbmEsXFxcbiAgICAgICAgICAgICAgICAgTmVicmFza2EsIE5ldmFkYSwgTmV3IEhhbXBzaGlyZSwgTmV3IEplcnNleSwgTmV3IE1leGljbywgTmV3IFlvcmssIE5vcnRoIENhcm9saW5hLFxcXG4gICAgICAgICAgICAgICAgIE5vcnRoIERha290YSwgT2hpbywgT2tsYWhvbWEsIE9yZWdvbiwgUGVubnN5bHZhbmlhLCBSaG9kZSBJc2xhbmQsIFNvdXRoIENhcm9saW5hLFxcXG4gICAgICAgICAgICAgICAgIFNvdXRoIERha290YSwgVGVubmVzc2VlLCBUZXhhcywgVXRhaCwgVmVybW9udCwgVmlyZ2luaWEsIFdhc2hpbmd0b24sIFdlc3QgVmlyZ2luaWEsXFxcbiAgICAgICAgICAgICAgICAgV2lzY29uc2luLCBXeW9taW5nJztcblxuICAgICAgICAgICAgICAgICByZXR1cm4gYWxsU3RhdGVzLnNwbGl0KC8sICsvZykubWFwKCBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgdmFsdWU6IHN0YXRlLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICAgICAgIGRpc3BsYXk6IHN0YXRlXG4gICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICByZXR1cm4gdHJlZWRhdGEuY2hpbGRyZW4ubWFwKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgIHZhbHVlOiBub2RlLFxuICAgICAgICAgICAgICAgICBkaXNwbGF5OiBub2RlLm5hbWUsXG4gICAgICAgICAgICAgICAgIGRpc3BsYXlMb3dlckNhc2U6IG5vZGUubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgIH0pOyovXG5cbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gZXh0cmFjdE5vZGVzKHRyZWVkYXRhLmNoaWxkcmVuKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXV0b0NvbXBsZXRlTGlzdDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZXh0cmFjdE5vZGVzKGxpc3RPZk5vZGVzKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbGlzdE9mTm9kZXMubWFwKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogbm9kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IG5vZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlMb3dlckNhc2U6IG5vZGUubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qKlxuICAgICAgICAgICAgICogQ3JlYXRlIGZpbHRlciBmdW5jdGlvbiBmb3IgYSBxdWVyeSBzdHJpbmdcbiAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgZnVuY3Rpb24gY3JlYXRlRmlsdGVyRm9yKHF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgdmFyIGxvd2VyY2FzZVF1ZXJ5ID0gYW5ndWxhci5sb3dlcmNhc2UocXVlcnkpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIGZpbHRlckZuKHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoc3RhdGUuZGlzcGxheUxvd2VyQ2FzZS5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSA9PT0gMCk7XG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9XG5cblxufSkoKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDYvNS8xNy5cbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnb3JnQ2hhcnQnKS5kaXJlY3RpdmUoJ2Nhc2NhZGVUb29sU2V0JywgY2FzY2FkZVRvb2xTZXQpO1xuXG4gICAgLypAbmdJbmplY3QqL1xuICAgIGZ1bmN0aW9uIGNhc2NhZGVUb29sU2V0KCkge1xuXG4gICAgICAgIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICByZXBsYWNlOiBmYWxzZSxcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogY2FzY2FkZVRvb2xTZXRDb250cm9sbGVyLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcHAvY2FzY2FkZS90ZXN0L29yZ2NoYXJ0L2RpcmVjdGl2ZXMvdG9vbHNldC50bXBsLmh0bWwnLFxuICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge30sXG4gICAgICAgICAgICBsaW5rOiBsaW5rXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGRpcmVjdGl2ZTtcblxuICAgICAgICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtLCBhdHRyLCB2bSkge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKkBuZ0luamVjdCovXG4gICAgZnVuY3Rpb24gY2FzY2FkZVRvb2xTZXRDb250cm9sbGVyKHRvb2xTZXRTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0uaXNFeHBhbmRBbGxNb2RlID0gdG9vbFNldFNlcnZpY2UuaXNFeHBhbmRBbGxNb2RlKCk7XG4gICAgICAgIHZtLnRvZ2dsZUV4cGFuZEFsbE1vZGUgPSB0b2dnbGVFeHBhbmRBbGxNb2RlO1xuICAgICAgICB2bS5pbmNyZW1lbnRab29tU2NhbGUgPSBpbmNyZW1lbnRab29tU2NhbGU7XG4gICAgICAgIHZtLmRlY3JlbWVudFpvb21TY2FsZSA9IGRlY3JlbWVudFpvb21TY2FsZTtcbiAgICAgICAgdm0uem9vbVNjYWxlID0gdG9vbFNldFNlcnZpY2UuZ2V0Wm9vbVNjYWxlKCk7XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlRXhwYW5kQWxsTW9kZSgpIHtcbiAgICAgICAgICAgIHZtLmlzRXhwYW5kQWxsTW9kZSA9IHRvb2xTZXRTZXJ2aWNlLnRvZ2dsZUV4cGFuZEFsbE1vZGUoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBpbmNyZW1lbnRab29tU2NhbGUoKSB7XG4gICAgICAgICAgICB2bS56b29tU2NhbGUgPSB0b29sU2V0U2VydmljZS5pbmNyZW1lbnRab29tU2NhbGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGRlY3JlbWVudFpvb21TY2FsZSgpIHtcbiAgICAgICAgICAgIHZtLnpvb21TY2FsZSA9IHRvb2xTZXRTZXJ2aWNlLmRlY3JlbWVudFpvb21TY2FsZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gNi81LzE3LlxuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdvcmdDaGFydCcpLmZhY3RvcnkoJ3Rvb2xTZXRTZXJ2aWNlJywgdG9vbFNldFNlcnZpY2UpO1xuXG4gICAgLypAbmdJbmplY3QqL1xuICAgIGZ1bmN0aW9uIHRvb2xTZXRTZXJ2aWNlKCkge1xuXG4gICAgICAgIHZhciBpc0FsbEV4cGFuZGVkTW9kZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBMT1dFU1RfWk9PTV9TQ0FMRSA9IDE7XG4gICAgICAgIHZhciB6b29tU2NhbGUgPSBMT1dFU1RfWk9PTV9TQ0FMRTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaXNFeHBhbmRBbGxNb2RlOiBpc0V4cGFuZEFsbE1vZGUsXG4gICAgICAgICAgICB0b2dnbGVFeHBhbmRBbGxNb2RlOiB0b2dnbGVFeHBhbmRBbGxNb2RlLFxuICAgICAgICAgICAgZ2V0Wm9vbVNjYWxlOiBnZXRab29tU2NhbGUsXG4gICAgICAgICAgICBzZXRab29tU2NhbGU6IHNldFpvb21TY2FsZSxcbiAgICAgICAgICAgIGluY3JlbWVudFpvb21TY2FsZTogaW5jcmVtZW50Wm9vbVNjYWxlLFxuICAgICAgICAgICAgZGVjcmVtZW50Wm9vbVNjYWxlOiBkZWNyZW1lbnRab29tU2NhbGVcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBpc0V4cGFuZEFsbE1vZGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gaXNBbGxFeHBhbmRlZE1vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB0b2dnbGVFeHBhbmRBbGxNb2RlKCkge1xuICAgICAgICAgICAgaXNBbGxFeHBhbmRlZE1vZGUgPSAhaXNBbGxFeHBhbmRlZE1vZGU7XG4gICAgICAgICAgICByZXR1cm4gaXNBbGxFeHBhbmRlZE1vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRab29tU2NhbGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gem9vbVNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Wm9vbVNjYWxlKHNjYWxlKSB7XG4gICAgICAgICAgICBpZiAoc2NhbGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgLy8gem9vbVNjYWxlID0gc2NhbGU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHpvb21TY2FsZSA9IExPV0VTVF9aT09NX1NDQUxFICsgc2NhbGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB6b29tU2NhbGUgPSBzY2FsZTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd6b29tIHNjYWxlJywgem9vbVNjYWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGluY3JlbWVudFpvb21TY2FsZSgpIHtcbiAgICAgICAgICAgIHpvb21TY2FsZSArPSAwLjE7XG5cbiAgICAgICAgICAgIHJldHVybiB6b29tU2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBkZWNyZW1lbnRab29tU2NhbGUoKSB7XG4gICAgICAgICAgICBpZiAoem9vbVNjYWxlID4gMSkge1xuICAgICAgICAgICAgICAgIHpvb21TY2FsZSAtPSAwLjE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB6b29tU2NhbGU7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gNS8zMS8xNy5cbiAqL1xuKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgYW5ndWxhci5tb2R1bGUoJ29yZ0NoYXJ0JykuZGlyZWN0aXZlKCdjYXNjYWRlVHJlZU5vZGUnLCBjYXNjYWRlVHJlZU5vZGUpO1xuXG4gICAgLypAbmdJbmplY3QqL1xuICAgIGZ1bmN0aW9uIGNhc2NhZGVUcmVlTm9kZSh0cmVlVmlld1NlcnZpY2UsICR0aW1lb3V0LCAkZG9jdW1lbnQsJHJvb3RTY29wZSkge1xuXG4gICAgICAgIHZhciBjYXNjYWRlVHJlZU5vZGVEaXJlY3RpdmUgPSB7XG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgcmVwbGFjZTogZmFsc2UsXG4gICAgICAgICAgICAvLyByZXF1aXJlOideY2FzY2FkZVRyZWVWaWV3JyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IENhc2NhZGVUcmVlTm9kZUNvbnRyb2xsZXIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2FwcC9jYXNjYWRlL3Rlc3Qvb3JnY2hhcnQvZGlyZWN0aXZlcy90cmVlbm9kZS50bXBsLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xuICAgICAgICAgICAgICAgIG5vZGVJZDogJ0AnLFxuICAgICAgICAgICAgICAgIG5vZGVBY3Rpb25zOiAnQCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsaW5rOiBsaW5rXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGNhc2NhZGVUcmVlTm9kZURpcmVjdGl2ZTtcblxuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW0sIGF0dHJzLCB2bSkge1xuICAgICAgICAgICAgdm0uaWQgPSBhdHRycy5ub2RlaWQ7XG4gICAgICAgICAgICB2bS5ub2RlQWN0aW9ucyA9IGFuZ3VsYXIuZnJvbUpzb24oYXR0cnMubm9kZWFjdGlvbnMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codm0ubm9kZUFjdGlvbnMpO1xuICAgICAgICAgICAgdm0uaXNQaW5uZWROb2RlID0gZmFsc2U7XG4gICAgICAgICAgICB2bS5ub2RlID0gdHJlZVZpZXdTZXJ2aWNlLmZpbmRCeUlkKGF0dHJzLm5vZGVpZCk7XG4gICAgICAgICAgICB2bS5ub2RlQ2xhc3MgPSAnbm9kZS1sYWJlbCBub2RlLScgKyB2bS5ub2RlLnR5cGUrICcgbm9kZS0nK3ZtLmlkO1xuXG4gICAgICAgICAgICAvLyB2bS5pc1Bpbm5lZE5vZGUgPSB0cnVlO1xuICAgICAgICAgICAgdm0uaXNFeHBhbmRlZFZpZXcgPSBmYWxzZTtcbiAgICAgICAgICAgIHZtLmlzQWN0aXZlID0gZmFsc2U7XG5cbiAgICAgICAgICAgIHZtLndoZW5Nb3VzZUVudGVyID0gd2hlbk1vdXNlRW50ZXI7XG4gICAgICAgICAgICB2bS53aGVuTW91c2VMZWF2ZSA9IHdoZW5Nb3VzZUxlYXZlO1xuICAgICAgICAgICAgdm0udG9nZ2xlUGlubmVkTW9kZSA9IHRvZ2dsZVBpbm5lZE1vZGU7XG4gICAgICAgICAgICB2bS5tYWtlQ2FsbEJhY2sgPSBtYWtlQ2FsbEJhY2s7XG4gICAgICAgICAgICB2bS5tYWtlTm9kZUFjdGl2ZSA9IG1ha2VOb2RlQWN0aXZlO1xuICAgICAgICAgICAgdmFyIG5vZGVET01FbGVtZW50ID0gYW5ndWxhci5lbGVtZW50KGVsZW0uY2hpbGRyZW4oKVswXSk7XG4gICAgICAgICAgICAvKiAgICAgICAgICAgIGVsZW0ub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgIGVsZW0uYWRkQ2xhc3MoJ2FjdGl2ZS1ub2RlJyk7XG4gICAgICAgICAgICAgfSk7Ki9cblxuICAgICAgICAgICAgZnVuY3Rpb24gbWFrZU5vZGVBY3RpdmUoKSB7XG4gICAgICAgICAgICAgICAgY2xlYXJBbGxPdGhlckFjdGl2ZU5vZGVzKCk7XG4gICAgICAgICAgICAgICAgdm0uaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB3aGVuTW91c2VFbnRlcigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW91c2UgRW50ZXJlZCcpO1xuICAgICAgICAgICAgICAgIHZtLmlzRXhwYW5kZWRWaWV3ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyB2bS5pc1Bpbm5lZE5vZGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB3aGVuTW91c2VMZWF2ZSgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW91c2UgbGVhdmVkJyk7XG4gICAgICAgICAgICAgICAgdm0uaXNFeHBhbmRlZFZpZXcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgIHZtLmlzUGlubmVkTm9kZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICB9LDEwMDApOyovXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVBpbm5lZE1vZGUoKSB7XG4gICAgICAgICAgICAgICAgdm0uaXNQaW5uZWROb2RlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5pc1Bpbm5lZE5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBtYWtlQ2FsbEJhY2soY2FsbEJhY2tGdW5jTmFtZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNhbGxCYWNrRnVuY05hbWUpO1xuICAgICAgICAgICAgICAgIHNjb3BlLiRwYXJlbnQudm0ubWFrZUNhbGxCYWNrKGNhbGxCYWNrRnVuY05hbWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjbGVhckFsbE90aGVyQWN0aXZlTm9kZXMoKXtcbi8qICAgICAgICAgICAgICAgIGVsZW0uZmluZCgnLm5vZGUtbGFiZWwnKTsvL1RPRE9cbiAgICAgICAgICAgICAgICBlbGVtLnBhcmVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhY3RpdmUtbm9kZScpOyovXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdhcHA6bm9kZXM6Y2xlYXJhY3RpdmUnLHsnZGF0YSc6ICcnfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmRSZWxldmFudE5vZGUoa2xhc3Mpe1xuICAgICAgICAgICAgICAgIGVsZW0uZmluZCgnLnRyZWUtaG9sZGVyJyk7Ly9UT0RPXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmdW5jdGlvbiBvbkRvY3VtZW50Q2xpY2soZXYpIHtcblxuICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgY2xpY2tlZCBvdXRzaWRlIGFuZCBkaXNjYXJkIEFjdGl2ZVxuICAgICAgICAgICAgICAgIGlmIChlbGVtICE9PSBldi50YXJnZXQgJiYgIWVsZW1bMF0uY29udGFpbnMoZXYudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL3JlbW92ZSBldmVudCBoYW5kbGVycyB3aGVuIGN1c3RvbSBkaXJlY3RpdmUgZGVzdHJveWVkXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkRlc3Ryb3koKSB7XG4gICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICRkb2N1bWVudC5vbignY2xpY2snLCBvbkRvY3VtZW50Q2xpY2spO1xuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIG9uRGVzdHJveSk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qQG5nSW5qZWN0Ki9cbiAgICBmdW5jdGlvbiBDYXNjYWRlVHJlZU5vZGVDb250cm9sbGVyKHRyZWVWaWV3U2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICAvKiAgICAgICAgdm0ubm9kZSA9IHRyZWVWaWV3U2VydmljZS5maW5kQnlJZCh2bS5ub2RlSWQpO1xuICAgICAgICAgdm0ubm9kZUNsYXNzID0gJ25vZGUtbGFiZWwgbm9kZS0nK3ZtLm5vZGUudHlwZTsqL1xuXG4gICAgfVxufSkoKTtcbiIsIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDUvMzAvMTcuXG4gKi9cbihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdvcmdDaGFydCcpLmRpcmVjdGl2ZSgnY2FzY2FkZVRyZWVWaWV3JywgY2FzY2FkZVRyZWVWaWV3KTtcblxuICAgIC8qQG5nSW5qZWN0Ki9cbiAgICBmdW5jdGlvbiBjYXNjYWRlVHJlZVZpZXcoJGZpbHRlciwgJGNvbXBpbGUsIHRyZWVWaWV3U2VydmljZSwgJHRpbWVvdXQsIHRvb2xTZXRTZXJ2aWNlLCAkd2luZG93KSB7XG4gICAgICAgIHZhciB0cmVlVmlld0RpcmVjdGl2ZSA9IHtcbiAgICAgICAgICAgIHJlcGxhY2U6ICdmYWxzZScsXG4gICAgICAgICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgICAgICAgc2NvcGU6IHt9LFxuICAgICAgICAgICAgYmluZFRvQ29udHJvbGxlcjoge1xuICAgICAgICAgICAgICAgIGRhdGE6ICc9JyxcbiAgICAgICAgICAgICAgICBhYm46ICcmJyxcbiAgICAgICAgICAgICAgICBub2RlQWN0aW9uczogJ0AnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29udHJvbGxlcjogVHJlZVZpZXdEaXJlY3RpdmVDb250cm9sbGVyLFxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxuICAgICAgICAgICAgbGluazogbGlua1xuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGxpbmsoc2NvcGUsIGVsZW0sIGF0dHJzLCB2bSkge1xuICAgICAgICAgICAgLy9UT0RPIEZldGNoIEZyb20gdGhlIGRiIGFuZCBhZGQgdG8gdGhlIHNlcnZpY2VcbiAgICAgICAgICAgIHZhciB0cmVlZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJSb290Tm9kZVwiLFxuICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDFcIixcbiAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMFwiLFxuICAgICAgICAgICAgICAgIFwiYWRkYWJsZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcImVkaXRhYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwicmVtb3ZhYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwiZW5hYmxlYmxlXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwicm9vdFwiOnRydWUsXG4gICAgICAgICAgICAgICAgXCJjaGlsZHJlblwiOiBbe1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJMYW5kaW5nIEFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMlwiLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMVwiLFxuICAgICAgICAgICAgICAgICAgICBcImFkZGFibGVcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJlZGl0YWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcInJlbW92YWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcImVuYWJsYWJsZVwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcImVuYWJsZVwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJjaGlsZHJlblwiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWNjb3VudCAxXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjaGlsZHJlblwiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRyYWNraW5nIGxpbmsgMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmFibGVcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRyYWNraW5nIGxpbmsgMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmFibGVcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRyYWNraW5nIGxpbmsgM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlM1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZW5hYmxhYmxlXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbmFibGVcIjogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkFjY291bnQgMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkN1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTJcIlxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJBY2NvdW50IDNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUyXCJcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkxhbmRpbmcgQlwiLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQ4XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUxXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiY2hpbGRyZW5cIjogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIkFjY291bnQgNFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUyXCJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiQWNjb3VudCA1XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IFwiaWQxMVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTJcIlxuICAgICAgICAgICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJBY2NvdW50IDZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogXCJpZDEyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiXG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJMYW5kaW5nIENcIixcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidHlwZTFcIixcbiAgICAgICAgICAgICAgICAgICAgXCJjaGlsZHJlblwiOiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VidG9waWMgN1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VidG9waWMgOFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCJcbiAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiU3VidG9waWMgOVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiBcImlkMTZcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUzXCJcbiAgICAgICAgICAgICAgICAgICAgfV1cbiAgICAgICAgICAgICAgICB9XVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdmFyIG5vZGVBY3RpdmVDbGVhckxpc3RlbmVyO1xuICAgICAgICAgICAgdmFyIG5vZGVMaXN0ID0gW107XG4gICAgICAgICAgICB2YXIgbSA9IFsyMCwgMjAsIDIwLCAyMF0sXG4gICAgICAgICAgICAgICAgdyA9ICR3aW5kb3cuaW5uZXJXaWR0aCAtIDIwIC0gbVsxXSAtIG1bM10sXG4gICAgICAgICAgICAgICAgaCA9IDYwMCAtIG1bMF0gLSBtWzJdLFxuICAgICAgICAgICAgICAgIGkgPSAwLFxuICAgICAgICAgICAgICAgIHIgPSA4MDAsXG4gICAgICAgICAgICAgICAgeCA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgd10pLnJhbmdlKFswLCB3XSksXG4gICAgICAgICAgICAgICAgeSA9IGQzLnNjYWxlLmxpbmVhcigpLmRvbWFpbihbMCwgaF0pLnJhbmdlKFswLCBoXSksXG4gICAgICAgICAgICAgICAgcm9vdDtcblxuICAgICAgICAgICAgdmFyIHdyYXBwZXJFbGVtZW50ID0gZDMuc2VsZWN0KGVsZW1bMF0pO1xuICAgICAgICAgICAgdmFyIGxhc3RTZWFyY2hlZFBhdGggPSBbXTtcbiAgICAgICAgICAgIGVsZW0uYXBwZW5kKCRjb21waWxlKFwiPGRpdiBsYXlvdXQ9XFxcInJvd1xcXCIgbGF5b3V0LWFsaWduPVxcXCJzcGFjZS1hcm91bmQgY2VudGVyXFxcIj48ZGl2IGZsZXg+PGNhc2NhZGUtdHJlZS1zZWFyY2gtYm94PjwvY2FzY2FkZS10cmVlLXNlYXJjaC1ib3g+PC9kaXY+PGRpdiBmbGV4PjxjYXNjYWRlLXRvb2wtc2V0PjwvY2FzY2FkZS10b29sLXNldD48L2Rpdj48L2Rpdj5cIikoc2NvcGUpKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gb25Jbml0KCkge1xuICAgICAgICAgICAgICAgIGFjdGl2YXRlV2F0Y2hlcnMoKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZVdhdGNoZXJzKCkge1xuICAgICAgICAgICAgICAgIG9uU2VhcmNoV2F0Y2goKTtcbiAgICAgICAgICAgICAgICBvblpvb21XYXRjaCgpO1xuICAgICAgICAgICAgICAgIG9uRXhwYW5kV2F0Y2goKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25FeHBhbmRXYXRjaCgpIHtcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9vbFNldFNlcnZpY2UuaXNFeHBhbmRBbGxNb2RlKClcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoaXNJbkV4cGFuZEFsbE1vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzSW5FeHBhbmRBbGxNb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBleHBhbmRBbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxhcHNlQWxsKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvblNlYXJjaFdhdGNoKCkge1xuICAgICAgICAgICAgICAgIHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cmVlVmlld1NlcnZpY2UuZ2V0U2VhcmNoZWROb2RlKCk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobm9kZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL0ZpcnN0IGZpbmQgYW5kIGhpZ2hsaWdodCB0aGUgcGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0UGF0aChub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXNvbHZlZE5vZGUgPSBnZXRUcmVlTm9kZUJ5T2JqZWN0KG5vZGUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9UT0RPIHJlbW92ZSBsYXRlciBjb3ogZXhwYW5kaW5nIG9jY3VycyB3aGVuIGhpZ2hsaWdodGluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogICAgICAgICAgICAgICAgICAgICAgICBleHBhbmROb2RlKHJlc29sdmVkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlKHJlc29sdmVkTm9kZSk7Ki9cblxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc29sdmVkTm9kZS54LCByZXNvbHZlZE5vZGUueSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJBbGxBY3RpdmVOb2RlcygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ha2VOb2RlQWN0aXZlKHJlc29sdmVkTm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFuVG9UaGVOb2RlKHJlc29sdmVkTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25ab29tV2F0Y2goKSB7XG4gICAgICAgICAgICAgICAgc2NvcGUuJHdhdGNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRvb2xTZXRTZXJ2aWNlLmdldFpvb21TY2FsZSgpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uICh6b29tU2NhbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coem9vbVNjYWxlKTtcbiAgICAgICAgICAgICAgICAgICAgdmlzLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jYWxsKHpvb21PYmplY3QudHJhbnNsYXRlKFsxNTAsIDEwMF0pLnNjYWxlKHpvb21TY2FsZSkuc2NhbGVFeHRlbnQoWzEsIDhdKS5ldmVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb25Jbml0KCk7XG5cbiAgICAgICAgICAgIHZhciB2aXMgPSB3cmFwcGVyRWxlbWVudC5hcHBlbmQoXCJkaXZcIikuYXR0cihcImxheW91dFwiLCBcInJvd1wiKS5hdHRyKFwibGF5b3V0LWFsaWduXCIsIFwic3BhY2UtYXJvdW5kIGNlbnRlclwiKVxuICAgICAgICAgICAgICAgIC5jYWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUodGhpc1swXSkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcImRpdlwiKS5hdHRyKFwiZmxleFwiLCBcIlwiKS5jYWxsKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUodGhpc1swXSkoc2NvcGUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmFwcGVuZChcInN2ZzpzdmdcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInZpZXdCb3hcIiwgXCIwIDAgNjAwIDYwMFwiKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdyArIG1bMV0gKyBtWzNdKVxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGggKyBtWzBdICsgbVsyXSlcbiAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnOmdcIilcbiAgICAgICAgICAgICAgICAvLy5hdHRyKFwicG9pbnRlci1ldmVudHNcIiwgXCJhbGxcIilcbiAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIG1bM10gKyBcIixcIiArIG1bMF0gKyBcIilcIilcbiAgICAgICAgICAgICAgICAvLy5jYWxsKGQzLmJlaGF2aW9yLnpvb20oKS5zY2FsZUV4dGVudChbMSw4XSkub24oXCJ6b29tXCIsem9vbSkpO1xuICAgICAgICAgICAgICAgIC8vLmNhbGwoZDMuYmVoYXZpb3Iuem9vbSgpLngoeCkueSh5KS5zY2FsZUV4dGVudChbMSwgOF0pLm9uXG4gICAgICAgICAgICAgICAgLmNhbGwoZDMuYmVoYXZpb3Iuem9vbSgpLm9uKFwiem9vbVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRvb2xTZXRTZXJ2aWNlLnNldFpvb21TY2FsZShkMy5ldmVudC5zY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIHNjb3BlLiRhcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkMy5ldmVudC5zY2FsZSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHZpcy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgZDMuZXZlbnQudHJhbnNsYXRlICsgXCIpXCIgKyBcIiBzY2FsZShcIiArIGQzLmV2ZW50LnNjYWxlICsgXCIpXCIpXG4gICAgICAgICAgICAgICAgICAgIHZpcy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgZDMuZXZlbnQudHJhbnNsYXRlICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIH0pKS5vbihcImNsaWNrXCIsIHN0b3BQcm9wb2dhdGlvbiwgZmFsc2UpLmNhbGwoZDMuYmVoYXZpb3IuZHJhZygpLm9uKFwiZHJhZ3N0YXJ0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSkub24oXCJkcmFnXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkcmFnZ2VkXCIpO1xuICAgICAgICAgICAgICAgICAgICBkMy5ldmVudC5zb3VyY2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9KSkuYXBwZW5kKFwiZ1wiKS5hdHRyKFwid2lkdGhcIiwgMTYwKS5hdHRyKFwiaGVpZ2h0XCIsIDEyMCkuYXR0cihcImNsYXNzXCIsIFwidHJlZS1ob2xkZXJcIikvKi5jYWxsKGQzLmJlaGF2aW9yLmRyYWcoKS5vbihcImRyYWdzdGFydFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgfSkub24oXCJkcmFnXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRyYWdnZWRcIik7XG4gICAgICAgICAgICAgfSkpKi87XG5cbiAgICAgICAgICAgIC8vVE9ETyB1bmNvbW1lbnQgbGF0ZXJcbiAgICAgICAgICAgIC8qICAgICAgICAgICAgdmlzLmFwcGVuZChcInJlY3RcIilcbiAgICAgICAgICAgICAvLyAuYXR0cihcImNsYXNzXCIsIFwib3ZlcmxheVwiKVxuICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgdyArIG1bMV0gKyBtWzNdKVxuICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGggKyBtWzBdICsgbVsyXSlcbiAgICAgICAgICAgICAuYXR0cihcIm9wYWNpdHlcIiwgMCkub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgc3RvcFByb3BvZ2F0aW9uKCk7XG4gICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgICB9KTsqL1xuXG4gICAgICAgICAgICB2YXIgdHJlZSA9IGQzLmxheW91dC50cmVlKClcbiAgICAgICAgICAgICAgICAuc2l6ZShbaCwgd10pXG4gICAgICAgICAgICAgICAgLm5vZGVTaXplKFsxMTAsIDYwXSlcbiAgICAgICAgICAgICAgICAuc2VwYXJhdGlvbihmdW5jdGlvbiBzZXBhcmF0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEucGFyZW50ID09IGIucGFyZW50ID8gMiA6IDI7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBkaWFnb25hbCA9IGQzLnN2Zy5kaWFnb25hbCgpXG4gICAgICAgICAgICAgICAgLnByb2plY3Rpb24oZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFtkLnggKyA4MCwgZC55ICsgODBdO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByb290ID0gdHJlZWRhdGE7XG4gICAgICAgICAgICByb290LngwID0gaCAvIDI7XG4gICAgICAgICAgICByb290LnkwID0gMDtcblxuICAgICAgICAgICAgZnVuY3Rpb24gdG9nZ2xlQWxsKGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBkLmNoaWxkcmVuLmZvckVhY2godG9nZ2xlQWxsKTtcbiAgICAgICAgICAgICAgICAgICAgdG9nZ2xlKGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGV4cGFuZEFsbEFmdGVyKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSAoZC5jaGlsZHJlbikgPyBkLmNoaWxkcmVuIDogZC5fY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgaWYgKGQuX2NoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGQuY2hpbGRyZW4gPSBkLl9jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgZC5fY2hpbGRyZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW4pXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goZXhwYW5kQWxsQWZ0ZXIpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VBbGxBZnRlcihkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gKGQuY2hpbGRyZW4pID8gZC5jaGlsZHJlbiA6IGQuX2NoaWxkcmVuO1xuICAgICAgICAgICAgICAgIGlmIChkLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgICAgIGQuX2NoaWxkcmVuID0gZC5jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgZC5jaGlsZHJlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbilcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaChjb2xsYXBzZUFsbEFmdGVyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZXhwYW5kQWxsKCkge1xuICAgICAgICAgICAgICAgIGV4cGFuZEFsbEFmdGVyKHJvb3QpO1xuICAgICAgICAgICAgICAgIHVwZGF0ZShyb290KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY29sbGFwc2VBbGwoKSB7XG4gICAgICAgICAgICAgICAgY29sbGFwc2VBbGxBZnRlcihyb290KTtcbiAgICAgICAgICAgICAgICB1cGRhdGUocm9vdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJvb3QpO1xuXG4vLyBpbml0aWFsaXplIHRoZSBkaXNwbGF5IHRvIHNob3cgYSBmZXcgbm9kZXMuXG4gICAgICAgICAgICByb290LmNoaWxkcmVuLmZvckVhY2godG9nZ2xlQWxsKTtcbi8vdG9nZ2xlKHJvb3QuY2hpbGRyZW5bMV0pO1xuLy90b2dnbGUocm9vdC5jaGlsZHJlbls5XSk7XG5cblxuICAgICAgICAgICAgdXBkYXRlKHJvb3QpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoc291cmNlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGR1cmF0aW9uID0gZDMuZXZlbnQgJiYgZDMuZXZlbnQuYWx0S2V5ID8gNTAwMCA6IDUwMDtcblxuICAgICAgICAgICAgICAgIC8vIENvbXB1dGUgdGhlIG5ldyB0cmVlIGxheW91dC5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZXMgPSB0cmVlLm5vZGVzKHJvb3QpLnJldmVyc2UoKTtcblxuICAgICAgICAgICAgICAgIC8vIE5vcm1hbGl6ZSBmb3IgZml4ZWQtZGVwdGguXG4gICAgICAgICAgICAgICAgbm9kZXMuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICBkLnkgPSBkLmRlcHRoICogMjAwO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBub2Rlcy4uLlxuICAgICAgICAgICAgICAgIHZhciBub2RlID0gdmlzLnNlbGVjdEFsbChcImcubm9kZVwiKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShub2RlcywgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmlkIHx8IChkLmlkID0gKytpKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBFbnRlciBhbnkgbmV3IG5vZGVzIGF0IHRoZSBwYXJlbnQncyBwcmV2aW91cyBwb3NpdGlvbi5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZUVudGVyID0gbm9kZS5lbnRlcigpLmFwcGVuZChcInN2ZzpnXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm5vZGUtXCIgKyBkLmlkO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgc291cmNlLngwICsgXCIsXCIgKyBzb3VyY2UueTAgKyBcIilcIjtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkMy5ldmVudC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRvZ2dsZShkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZShkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkWydpbmZvJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbGF5dmlkKGRbJ2luZm8nXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy9BZGRpbmcgYSBwaWN0dXJlIHRvIHRoZSBub2RlIGNpcmNsZVxuXG4gICAgICAgICAgICAgICAgbm9kZUVudGVyLmFwcGVuZChcInN2ZzpjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDFlLTYpXG4gICAgICAgICAgICAgICAgICAgIC5zdHlsZShcImZpbGxcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLl9jaGlsZHJlbiA/IFwibGlnaHRzdGVlbGJsdWVcIiA6IFwiI2ZmZlwiO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBub2RlVGV4dCA9IG5vZGVFbnRlclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKFwic3ZnOmZvcmVpZ25PYmplY3RcIilcbiAgICAgICAgICAgICAgICAgICAgLy8uYXR0cihcInlcIiwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5jaGlsZHJlbiB8fCBkLl9jaGlsZHJlbiA/IC0xMCA6IDEwOyB9KVxuICAgICAgICAgICAgICAgICAgICAvLy5hdHRyKFwiZHhcIiwgXCIuMzVlbVwiKVxuICAgICAgICAgICAgICAgICAgICAvLy5hdHRyKFwieFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vICByZXR1cm4gZC5jaGlsZHJlbiB8fCBkLl9jaGlsZHJlbiA/IC0xMCA6IDEwO1xuICAgICAgICAgICAgICAgICAgICAvL30pXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwieVwiLCAtMzApXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwieFwiLCAtNSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0ZXh0LWFuY2hvclwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQuY2hpbGRyZW4gfHwgZC5fY2hpbGRyZW4gPyBcImVuZFwiIDogXCJzdGFydFwiO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMWUtNilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3dpZHRoJywgMTYwKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cignaGVpZ2h0JywgMTIwKVxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCd4aHRtbDpkaXYnKVxuICAgICAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9kZS1sYWJlbFwiICsgXCIgbm9kZS1cIiArIGQudHlwZVxuICAgICAgICAgICAgICAgICAgICAgfSkuYXR0cihcIm5nLXNob3dcIiwgXCJ0cnVlXCIpLmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgJGNvbXBpbGUodGhpc1swXS5wYXJlbnROb2RlKShzY29wZSk7XG4gICAgICAgICAgICAgICAgICAgICB9KSovXG4gICAgICAgICAgICAgICAgICAgIC5jbGFzc2VkKFwiZGlzYWJsZWRcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmVuYWJsZSAhPT0gdW5kZWZpbmVkICYmICFkLmVuYWJsZTtcbiAgICAgICAgICAgICAgICAgICAgfSkub24oXCJjbGlja1wiLCBvbkNsaWNrZWROb2RlKS8qLmNhbGwoZDMuYmVoYXZpb3IuZHJhZygpLm9uKFwiZHJhZ3N0YXJ0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgZDMuZXZlbnQuc291cmNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgIH0pLm9uKFwiZHJhZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZHJhZ2dlZFwiKTtcbiAgICAgICAgICAgICAgICAgfSkpKi87XG5cbiAgICAgICAgICAgICAgICBub2RlVGV4dC5hcHBlbmQoXCJjYXNjYWRlLXRyZWUtbm9kZVwiKS5hdHRyKFwibm9kZUlkXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkLmlkO1xuICAgICAgICAgICAgICAgIH0pLmF0dHIoXCJpc1Bpbm5lZE5vZGVcIiwgXCJmYWxzZVwiKS5hdHRyKFwibm9kZUFjdGlvbnNcIiwgYXR0cnMubm9kZWFjdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb21waWxlKHRoaXMpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgLmNhbGwoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAkY29tcGlsZSh0aGlzWzBdLnBhcmVudE5vZGUpKHNjb3BlKTtcbiAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICAgLy9FbmFibGUgbm9kZSBidXR0b25cbiAgICAgICAgICAgICAgICAgbm9kZVRleHQuZmlsdGVyKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBkLmVuYWJsYWJsZTtcbiAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgLmFwcGVuZChcImlucHV0XCIsIFwiLlwiKVxuICAgICAgICAgICAgICAgICAuYXR0cihcInR5cGVcIiwgXCJjaGVja2JveFwiKVxuICAgICAgICAgICAgICAgICAucHJvcGVydHkoXCJjaGVja2VkXCIsIGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBkLmVuYWJsZTtcbiAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgLm9uKFwiY2hhbmdlXCIsIHRvZ2dsZUVuYWJsZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgc3RvcFByb3BvZ2F0aW9uLCB0cnVlKTtcblxuICAgICAgICAgICAgICAgICAvL05vZGUgbGFiZWxcbiAgICAgICAgICAgICAgICAgbm9kZVRleHQuYXBwZW5kKFwic3BhblwiKVxuICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibm9kZS10ZXh0XCIpXG4gICAgICAgICAgICAgICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBkLm5hbWUgKyAnIFggLSAnICsgZC54ICsgJywgWSAtICcgKyBkLnk7XG4gICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgIC8vRWRpdCBub2RlIGJ1dHRvblxuICAgICAgICAgICAgICAgICBub2RlVGV4dC5maWx0ZXIoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIGQuZWRpdGFibGU7XG4gICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgIC5hcHBlbmQoXCJhXCIpXG4gICAgICAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlLWVkaXRcIilcbiAgICAgICAgICAgICAgICAgLm9uKFwiY2xpY2tcIiwgb25FZGl0Tm9kZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgLmFwcGVuZChcImlcIilcbiAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImZhIGZhLXBlbmNpbFwiKTtcblxuICAgICAgICAgICAgICAgICAvL0FkZCBub2RlIGJ1dHRvblxuICAgICAgICAgICAgICAgICBub2RlVGV4dC5maWx0ZXIoZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgcmV0dXJuIGQuYWRkYWJsZTtcbiAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgLmFwcGVuZChcImFcIilcbiAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGUtYWRkXCIpXG4gICAgICAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIG9uQWRkTm9kZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgLmFwcGVuZChcImlcIilcbiAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImZhIGZhLXBsdXNcIik7XG5cbiAgICAgICAgICAgICAgICAgLy9SZW1vdmUgbm9kZSBidXR0b25cbiAgICAgICAgICAgICAgICAgbm9kZVRleHQuZmlsdGVyKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgIHJldHVybiBkLnJlbW92YWJsZTtcbiAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgLmFwcGVuZChcImFcIilcbiAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGUtcmVtb3ZlXCIpXG4gICAgICAgICAgICAgICAgIC5vbihcImNsaWNrXCIsIG9uUmVtb3ZlTm9kZSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICAgLmFwcGVuZChcImlcIilcbiAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImZhIGZhLXRpbWVzXCIpOyovXG5cbiAgICAgICAgICAgICAgICAvLyBUcmFuc2l0aW9uIG5vZGVzIHRvIHRoZWlyIG5ldyBwb3NpdGlvbi5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZVVwZGF0ZSA9IG5vZGUudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbm9kZVVwZGF0ZS5zZWxlY3QoXCJjaXJjbGVcIilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDQuNSlcbiAgICAgICAgICAgICAgICAgICAgLnN0eWxlKFwiZmlsbFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGQuY2xhc3MgPT09ICdoaWdobGlnaHQtbGluaycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyNmZjQxMzYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkLl9jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAnbGlnaHRzdGVlbGJsdWUnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJyNmZmYnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIG5vZGVVcGRhdGUuc2VsZWN0KFwidGV4dFwiKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMSk7XG5cbiAgICAgICAgICAgICAgICAvLyBUcmFuc2l0aW9uIGV4aXRpbmcgbmRvZXMgdG8gdGhlIHBhcmVudCdzIG5ldyBwb3NpdGlvbi5cbiAgICAgICAgICAgICAgICB2YXIgbm9kZUV4aXQgPSBub2RlLmV4aXQoKS50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKGR1cmF0aW9uKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgc291cmNlLnggKyBcIixcIiArIHNvdXJjZS55ICsgXCIpXCI7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgIG5vZGVFeGl0LnNlbGVjdChcImNpcmNsZVwiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcInJcIiwgMWUtNik7XG4gICAgICAgICAgICAgICAgbm9kZUV4aXQuc2VsZWN0KFwidGV4dFwiKVxuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJmaWxsLW9wYWNpdHlcIiwgMWUtNik7XG5cbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGxpbmtzLi4uXG4gICAgICAgICAgICAgICAgdmFyIGxpbmsgPSB2aXMuc2VsZWN0QWxsKFwicGF0aC5saW5rXCIpXG4gICAgICAgICAgICAgICAgICAgIC5kYXRhKHRyZWUubGlua3Mobm9kZXMpLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGQudGFyZ2V0LmlkO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIEVudGVyIGFueSBuZXcgbGlua3MgYXQgaHRlIHBhcmVudCdzIHByZXZpb3VzIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgbGluay5lbnRlcigpLmluc2VydChcInN2ZzpwYXRoXCIsIFwiZ1wiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxuICAgICAgICAgICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6IHNvdXJjZS54MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5OiBzb3VyY2UueTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlhZ29uYWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IG9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGRpYWdvbmFsKTtcblxuICAgICAgICAgICAgICAgIC8vIFRyYW5zaXRpb24gbGlua3MgdG8gdGhlaXIgbmV3IHBvc2l0aW9uLlxuICAgICAgICAgICAgICAgIGxpbmsudHJhbnNpdGlvbigpXG4gICAgICAgICAgICAgICAgICAgIC5kdXJhdGlvbihkdXJhdGlvbilcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGRpYWdvbmFsKVxuICAgICAgICAgICAgICAgICAgICAvKiAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGQudGFyZ2V0LmNsYXNzID09PSBcImhpZ2hsaWdodC1saW5rXCIpP1wiaGlnaGxpZ2h0LWxpbmstc3Ryb2tlLWFjdGl2ZVwiOlwiaGlnaGxpZ2h0LWxpbmstc3Ryb2tlLWluYWN0aXZlXCI7XG4gICAgICAgICAgICAgICAgICAgICB9KTsqL1xuICAgICAgICAgICAgICAgICAgICAuc3R5bGUoXCJzdHJva2VcIiwgZnVuY3Rpb24gKGQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkLnRhcmdldC5jbGFzcyA9PT0gXCJoaWdobGlnaHQtbGlua1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiI2ZmNDEzNlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIFRyYW5zaXRpb24gZXhpdGluZyBub2RlcyB0byB0aGUgcGFyZW50J3MgbmV3IHBvc2l0aW9uLlxuICAgICAgICAgICAgICAgIGxpbmsuZXhpdCgpLnRyYW5zaXRpb24oKVxuICAgICAgICAgICAgICAgICAgICAuZHVyYXRpb24oZHVyYXRpb24pXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeDogc291cmNlLngsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeTogc291cmNlLnlcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGlhZ29uYWwoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogbyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ6IG9cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTdGFzaCB0aGUgb2xkIHBvc2l0aW9ucyBmb3IgdHJhbnNpdGlvbi5cbiAgICAgICAgICAgICAgICBub2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICAgICAgICAgIGQueDAgPSBkLng7XG4gICAgICAgICAgICAgICAgICAgIGQueTAgPSBkLnk7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmNvcHkobm9kZXMsIG5vZGVMaXN0KTtcblxuICAgICAgICAgICAgICAgIHRyZWVWaWV3U2VydmljZS5zZXROb2Rlcyhub2RlTGlzdCk7XG4gICAgICAgICAgICB9XG5cbi8vIFRvZ2dsZSBjaGlsZHJlblxuICAgICAgICAgICAgZnVuY3Rpb24gdG9nZ2xlKGQpIHtcbiAgICAgICAgICAgICAgICBpZiAoZC5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICBkLl9jaGlsZHJlbiA9IGQuY2hpbGRyZW47XG4gICAgICAgICAgICAgICAgICAgIGQuY2hpbGRyZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGQuY2hpbGRyZW4gPSBkLl9jaGlsZHJlbjtcbiAgICAgICAgICAgICAgICAgICAgZC5fY2hpbGRyZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gZXhwYW5kTm9kZShub2RlKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5jaGlsZHJlbiA9IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgICAgIG5vZGUuX2NoaWxkcmVuID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuLy8gem9vbSBpbiAvIG91dFxuICAgICAgICAgICAgZnVuY3Rpb24gem9vbShkKSB7XG4gICAgICAgICAgICAgICAgLy92aXMuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbDNhdGUoXCIgKyBkMy5ldmVudC50cmFuc2xhdGUgKyBcIilzY2FsZShcIiArIGQzLmV2ZW50LnNjYWxlICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIHZhciBub2RlcyA9IHZpcy5zZWxlY3RBbGwoXCJnLm5vZGVcIik7XG4gICAgICAgICAgICAgICAgbm9kZXMuYXR0cihcInRyYW5zZm9ybVwiLCB0cmFuc2Zvcm0pO1xuXG4gICAgICAgICAgICAgICAgLy8gVXBkYXRlIHRoZSBsaW5rcy4uLlxuICAgICAgICAgICAgICAgIHZhciBsaW5rID0gdmlzLnNlbGVjdEFsbChcInBhdGgubGlua1wiKTtcbiAgICAgICAgICAgICAgICBsaW5rLmF0dHIoXCJkXCIsIHRyYW5zbGF0ZSk7XG5cbiAgICAgICAgICAgICAgICAvLyBFbnRlciBhbnkgbmV3IGxpbmtzIGF0IGh0ZSBwYXJlbnQncyBwcmV2aW91cyBwb3NpdGlvblxuICAgICAgICAgICAgICAgIC8vbGluay5hdHRyKFwiZFwiLCBmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgICB2YXIgbyA9IHt4OiBkLngwLCB5OiBkLnkwfTtcbiAgICAgICAgICAgICAgICAvLyAgICAgIHJldHVybiBkaWFnb25hbCh7c291cmNlOiBvLCB0YXJnZXQ6IG99KTtcbiAgICAgICAgICAgICAgICAvLyAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gdHJhbnNmb3JtKGQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyB4KGQueSkgKyBcIixcIiArIHkoZC54KSArIFwiKVwiO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiB0cmFuc2xhdGUoZCkge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2VYID0geChkLnRhcmdldC5wYXJlbnQueSk7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZVkgPSB5KGQudGFyZ2V0LnBhcmVudC54KTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0WCA9IHgoZC50YXJnZXQueSk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFkgPSAoc291cmNlWCArIHRhcmdldFgpIC8gMjtcbiAgICAgICAgICAgICAgICB2YXIgbGlua1RhcmdldFkgPSB5KGQudGFyZ2V0LngwKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gXCJNXCIgKyBzb3VyY2VYICsgXCIsXCIgKyBzb3VyY2VZICsgXCIgQ1wiICsgdGFyZ2V0WCArIFwiLFwiICsgc291cmNlWSArIFwiIFwiICsgdGFyZ2V0WSArIFwiLFwiICsgeShkLnRhcmdldC54MCkgKyBcIiBcIiArIHRhcmdldFggKyBcIixcIiArIGxpbmtUYXJnZXRZICsgXCJcIjtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlc3VsdCk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uRWRpdE5vZGUoZCkge1xuICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSA5O1xuICAgICAgICAgICAgICAgIHZhciBpZCA9IE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnJlcGxhY2UoL1teYS16XSsvZywgJycpLnN1YnN0cigwLCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgIGFkZENoaWxkTm9kZShkLmlkLCB7XG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5ldyBjaGlsZCBub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiaWRcIjogaWQsXG4gICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInR5cGUyXCJcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzdG9wUHJvcG9nYXRpb24oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25BZGROb2RlKGQpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID0gOTtcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5yZXBsYWNlKC9bXmEtel0rL2csICcnKS5zdWJzdHIoMCwgbGVuZ3RoKTtcbiAgICAgICAgICAgICAgICBhZGRDaGlsZE5vZGUoZC5pZCwge1xuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuZXcgY2hpbGQgbm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IGlkLFxuICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0eXBlMlwiXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc3RvcFByb3BvZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uUmVtb3ZlTm9kZShkKSB7XG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gZC5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZihkKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICBkLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1cGRhdGUoZC5wYXJlbnQpO1xuICAgICAgICAgICAgICAgIHN0b3BQcm9wb2dhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBhZGRDaGlsZE5vZGUocGFyZW50SWQsIG5ld05vZGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGQzLnNlbGVjdCgnIycgKyAnbm9kZS0nICsgcGFyZW50SWQpO1xuICAgICAgICAgICAgICAgIHZhciBub2RlRGF0YSA9IG5vZGUuZGF0dW0oKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZURhdGEuY2hpbGRyZW4gPT09IHVuZGVmaW5lZCAmJiBub2RlRGF0YS5fY2hpbGRyZW4gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlRGF0YS5jaGlsZHJlbiA9IFtuZXdOb2RlXTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVEYXRhLl9jaGlsZHJlbiAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVEYXRhLl9jaGlsZHJlbi5wdXNoKG5ld05vZGUpO1xuICAgICAgICAgICAgICAgICAgICB0b2dnbGUobm9kZURhdGEpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZURhdGEuY2hpbGRyZW4gIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBub2RlRGF0YS5jaGlsZHJlbi5wdXNoKG5ld05vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB1cGRhdGUobm9kZSk7XG4gICAgICAgICAgICAgICAgc3RvcFByb3BvZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHRvZ2dsZUVuYWJsZShkKSB7XG4gICAgICAgICAgICAgICAgZC5lbmFibGUgPSAhZC5lbmFibGU7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBkMy5zZWxlY3QoJyMnICsgJ25vZGUtJyArIGQuaWQgKyBcIiAubm9kZS1sYWJlbFwiKVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZChcImRpc2FibGVkXCIsICFkLmVuYWJsZSk7XG4gICAgICAgICAgICAgICAgc3RvcFByb3BvZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgZnVuY3Rpb24gc3RvcFByb3BvZ2F0aW9uKCkge1xuICAgICAgICAgICAgICAgIGQzLmV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYWN0aXZlID0gZDMuc2VsZWN0KG51bGwpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkNsaWNrZWROb2RlKG5vZGUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZDMuZXZlbnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5vZGUpO1xuICAgICAgICAgICAgICAgIHZhciBpc1Jlc2V0ID0gbWFrZUNsaWNrZWROb2RlQWN0aXZlKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzUmVzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vVE9ETyBzY2FsZSBhY2NvcmRpbmcgdG8gdGhlIGJvdW5kc1xuICAgICAgICAgICAgICAgIC8vIHZhciBib3VuZHMgPSBkMy5zZWxlY3QoZWxlbVswXSkubm9kZSgpLmdldEJCb3goKTtcbiAgICAgICAgICAgICAgICAvLyB2YXIgc2NhbGUgPSBNYXRoLm1heCgxLCBNYXRoLm1pbig4LCAwLjkgLyBNYXRoLm1heChkLnggLCBkLnkgKSkpO1xuICAgICAgICAgICAgICAgIHBhblRvVGhlTm9kZShub2RlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gaGlnaGxpZ2h0UGF0aChub2RlKSB7XG4gICAgICAgICAgICAgICAgLy9UT0RPIG11c3QgaW5jbHVkZSB0aGUgcm9vdCBub2RlIGluIHRoZSBhcnJheVxuICAgICAgICAgICAgICAgIC8vUGF0aCBhcnJheSB0byBzdG9yZSBub2Rlc1xuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gc2VhcmNoV2l0aGluVHJlZSh0cmVlZGF0YSwgbm9kZS5uYW1lLCBbXSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQocGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9mdW5jdGlvbiB0byBvcGVuIHBhdGhzXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySGlnaExpZ2h0TGlua3MobGFzdFNlYXJjaGVkUGF0aCk7XG4gICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodExpbmtzKHBhdGgpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdTZWFyY2hlZCBub2RlICcgKyBub2RlLm5hbWUgKyAnIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxhc3RTZWFyY2hlZFBhdGggPSBwYXRoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBoaWdobGlnaHRMaW5rcyhwYXRoKSB7XG5cbiAgICAgICAgICAgICAgICBhbmd1bGFyLmZvckVhY2gocGF0aCwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcblxuICAgICAgICAgICAgICAgICAgICAvL1RPRE8gYXNzdW1lIHRoYXQgaWQgb2YgdGhlIHJvb3Qgbm9kZSBpcyAxLC5tYWtlIHRoaXMgbW9yZSBjb25zaXN0ZW50IGxhdGVyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmICh2YWx1ZS5pZCAhPT0naWQxJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuY2xhc3MgPSAnaGlnaGxpZ2h0LWxpbmsnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLl9jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLmNoaWxkcmVuID0gdmFsdWUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLl9jaGlsZHJlbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gY2xlYXJIaWdoTGlnaHRMaW5rcyhwYXRoKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5mb3JFYWNoKHBhdGgsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLmNsYXNzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5fY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLmNoaWxkcmVuID0gdmFsdWUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUuX2NoaWxkcmVuID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUodmFsdWUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHJlbW92ZUhpZ2hsaWdodChub2RlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGUuY2xhc3MgPT09ICdoaWdobGlnaHQtbGluaycpIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5jbGFzcyA9ICcnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gbm9kZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9zZWFyY2ggb24gdHJlZSBmb3IgYSBsaW5rXG4gICAgICAgICAgICBmdW5jdGlvbiBzZWFyY2hXaXRoaW5UcmVlKG5vZGUsIHNlYXJjaEtleSwgcGF0aCkge1xuICAgICAgICAgICAgICAgIGlmIChub2RlLm5hbWUgPT09IHNlYXJjaEtleSkgeyAvL2lmIHNlYXJjaCBpcyBmb3VuZCByZXR1cm4sIGFkZCB0aGUgb2JqZWN0IHRvIHRoZSBwYXRoIGFuZCByZXR1cm4gaXRcbiAgICAgICAgICAgICAgICAgICAgcGF0aC5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGF0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobm9kZS5jaGlsZHJlbiB8fCBub2RlLl9jaGlsZHJlbikgeyAvL2lmIGNoaWxkcmVuIGFyZSBjb2xsYXBzZWQgZDMgb2JqZWN0IHdpbGwgaGF2ZSB0aGVtIGluc3RhbnRpYXRlZCBhcyBfY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gKG5vZGUuY2hpbGRyZW4pID8gbm9kZS5jaGlsZHJlbiA6IG5vZGUuX2NoaWxkcmVuO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXRoLnB1c2gobm9kZSk7Ly8gd2UgYXNzdW1lIHRoaXMgcGF0aCBpcyB0aGUgcmlnaHQgb25lXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZm91bmQgPSBzZWFyY2hXaXRoaW5UcmVlKGNoaWxkcmVuW2ldLCBzZWFyY2hLZXksIHBhdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKSB7Ly8gd2Ugd2VyZSByaWdodCwgdGhpcyBzaG91bGQgcmV0dXJuIHRoZSBidWJibGVkLXVwIHBhdGggZnJvbSB0aGUgZmlyc3QgaWYgc3RhdGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7Ly93ZSB3ZXJlIHdyb25nLCByZW1vdmUgdGhpcyBwYXJlbnQgZnJvbSB0aGUgcGF0aCBhbmQgY29udGludWUgaXRlcmF0aW5nXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGF0aC5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHsvL25vdCB0aGUgcmlnaHQgb2JqZWN0LCByZXR1cm4gZmFsc2Ugc28gaXQgd2lsbCBjb250aW51ZSB0byBpdGVyYXRlIGluIHRoZSBsb29wXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG1ha2VDbGlja2VkTm9kZUFjdGl2ZShlbGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGlzUmVzZXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBpZiAoYWN0aXZlLm5vZGUoKSA9PT0gZWxlbSkge1xuICAgICAgICAgICAgICAgICAgICBpc1Jlc2V0ID0gcmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNSZXNldCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmUuY2xhc3NlZChcImFjdGl2ZVwiLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9IGQzLnNlbGVjdChlbGVtKS5jbGFzc2VkKFwiYWN0aXZlXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIHBhblRvVGhlTm9kZShub2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNjYWxlID0gMTsvL0ZJWE1FIGFkZCBzY2FsZSB0byBoaWdoZXIgaWYgbmVlZFxuICAgICAgICAgICAgICAgIHZhciB0cmFuc2xhdGUgPSBbbm9kZS54IC8gMiAtIHNjYWxlICogbm9kZS54LCBub2RlLnkgLyAyIC0gc2NhbGUgKiBub2RlLnldO1xuICAgICAgICAgICAgICAgIHZpcy50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDEyNTApXG4gICAgICAgICAgICAgICAgICAgIC5jYWxsKHpvb21PYmplY3QudHJhbnNsYXRlKHRyYW5zbGF0ZSkuc2NhbGUoc2NhbGUpLmV2ZW50KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogICAgICAgICAgICBmdW5jdGlvbiBjYWxjdWxhdGVUcmFuc2xhdGlvbihub2RlKSB7XG4gICAgICAgICAgICAgdmFyIHRybmFzbGF0aW9uU2V0PSBbXTtcbiAgICAgICAgICAgICBpZihub2RlLng8MzAwKXtcbiAgICAgICAgICAgICAzMDAtbm9kZS54O1xuICAgICAgICAgICAgIH1lbHNlIGlmKG5vZGUueD4zMDApe1xuICAgICAgICAgICAgIG5vZGUueC0zMDA7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH0qL1xuXG4gICAgICAgICAgICB2YXIgem9vbU9iamVjdCA9IGQzLmJlaGF2aW9yLnpvb20oKVxuICAgICAgICAgICAgICAgIC50cmFuc2xhdGUoWzAsIDBdKVxuICAgICAgICAgICAgICAgIC5zY2FsZSgxKVxuICAgICAgICAgICAgICAgIC5zY2FsZUV4dGVudChbMSwgOF0pXG4gICAgICAgICAgICAgICAgLm9uKFwiem9vbVwiLCB6b29tZWRXcmFwcGVyKTtcblxuXG4gICAgICAgICAgICBmdW5jdGlvbiB6b29tZWRXcmFwcGVyKCkge1xuICAgICAgICAgICAgICAgIC8vIGcuc3R5bGUoXCJzdHJva2Utd2lkdGhcIiwgMS41IC8gZDMuZXZlbnQuc2NhbGUgKyBcInB4XCIpO1xuICAgICAgICAgICAgICAgIHZpcy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgZDMuZXZlbnQudHJhbnNsYXRlICsgXCIpc2NhbGUoXCIgKyBkMy5ldmVudC5zY2FsZSArIFwiKVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJyZXNldCBjYWxsZWRcIik7XG4gICAgICAgICAgICAgICAgYWN0aXZlLmNsYXNzZWQoXCJhY3RpdmVcIiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGFjdGl2ZSA9IGQzLnNlbGVjdChudWxsKTtcblxuICAgICAgICAgICAgICAgIHZpcy50cmFuc2l0aW9uKClcbiAgICAgICAgICAgICAgICAgICAgLmR1cmF0aW9uKDc1MClcbiAgICAgICAgICAgICAgICAgICAgLmNhbGwoem9vbU9iamVjdC50cmFuc2xhdGUoWzE1MCwgMTAwXSkuc2NhbGUoMSkuZXZlbnQpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIGdldFRyZWVOb2RlQnlPYmplY3Qob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgdmFyIHRyZWVOb2RlID0gJGZpbHRlcignZmlsdGVyJykobm9kZUxpc3QsIHsnaWQnOiBvYmplY3QuaWR9LCB0cnVlKVswXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJlZU5vZGU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8qICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyKFwiY2FzY2FkZS10cmVlLXZpZXdcIik7XG4gICAgICAgICAgICAgJGNvbXBpbGUoZWxlbSkoc2NvcGUpOyovXG5cbiAgICAgICAgICAgIG5vZGVBY3RpdmVDbGVhckxpc3RlbmVyID0gc2NvcGUuJG9uKCdhcHA6bm9kZXM6Y2xlYXJhY3RpdmUnLCBvbkRlYWN0aXZhdGVOb2Rlcyk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG1ha2VOb2RlQWN0aXZlKGlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vZGVMaXN0ID0gZDMuc2VsZWN0QWxsKFwiLm5vZGUtXCIgKyBpZC50b1N0cmluZygpKTtcbiAgICAgICAgICAgICAgICBhbmd1bGFyLmVsZW1lbnQobm9kZUxpc3RbMF0pLmFkZENsYXNzKCdhY3RpdmUtbm9kZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBjbGVhckFsbEFjdGl2ZU5vZGVzKCkge1xuICAgICAgICAgICAgICAgIHZhciBub2RlTGlzdCA9IGQzLnNlbGVjdEFsbChcIi5ub2RlLWxhYmVsXCIpO1xuICAgICAgICAgICAgICAgIGFuZ3VsYXIuZm9yRWFjaChub2RlTGlzdCwgZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KHYpLnJlbW92ZUNsYXNzKCdhY3RpdmUtbm9kZScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbkRlYWN0aXZhdGVOb2RlcyhldiwgZGF0YSkge1xuICAgICAgICAgICAgICAgIGNsZWFyQWxsQWN0aXZlTm9kZXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2NvcGUuJG9uKCckZGVzdHJveScsIGRlc3Ryb3lMaXN0ZW5lcik7XG4gICAgICAgICAgICBmdW5jdGlvbiBkZXN0cm95TGlzdGVuZXIoKSB7XG4gICAgICAgICAgICAgICAgbm9kZUFjdGl2ZUNsZWFyTGlzdGVuZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJlZVZpZXdEaXJlY3RpdmU7XG4gICAgfVxuXG4gICAgLypAbmdJbmplY3QqL1xuICAgIGZ1bmN0aW9uIFRyZWVWaWV3RGlyZWN0aXZlQ29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsIHRyZWVWaWV3U2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5tYWtlQ2FsbEJhY2sgPSBtYWtlQ2FsbEJhY2s7XG5cbiAgICAgICAgZnVuY3Rpb24gbWFrZUNhbGxCYWNrKGlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYWxsZWQgdHJlZXZpZXcgY2FsbCBiYWNrIGFibicpO1xuICAgICAgICAgICAgJHNjb3BlLnZtW2lkZW50aWZpZXJdKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiAgICAgICAgZnVuY3Rpb24gb25Jbml0KCkge1xuICAgICAgICAgJHNjb3BlLiR3YXRjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICByZXR1cm4gdHJlZVZpZXdTZXJ2aWNlLmdldFNlYXJjaGVkTm9kZSgpO1xuICAgICAgICAgfSwgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgIGNvbnNvbGUubG9nKG5vZGUpO1xuICAgICAgICAgfSk7XG4gICAgICAgICB9XG5cbiAgICAgICAgIG9uSW5pdCgpOyovXG4gICAgICAgIC8qICAgICAgICB2YXIgc2VhcmNoTGlzdGVuZXIgPSAkcm9vdFNjb3BlLiRvbignY2hhcnQ6aGllcmFyY2h5OnNlYXJjaCcsIG9uU2VhcmNoKTtcblxuICAgICAgICAgZnVuY3Rpb24gb25TZWFyY2gobm9kZSkge1xuICAgICAgICAgY29uc29sZS5sb2cobm9kZSk7XG4gICAgICAgICB9XG5cblxuICAgICAgICAgJHJvb3RTY29wZS4kb24oJyRkZXN0cm95JywgZGVzdHJveUxpc3RlbmVyKTtcbiAgICAgICAgIGZ1bmN0aW9uIGRlc3Ryb3lMaXN0ZW5lcigpIHtcbiAgICAgICAgIHNlYXJjaExpc3RlbmVyKCk7XG4gICAgICAgICB9Ki9cbiAgICB9XG59KSgpO1xuIiwiLyoqXG4gKiBDcmVhdGVkIGJ5IHVzZXIgb24gNi8xLzE3LlxuICovXG4oZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdvcmdDaGFydCcpLmZhY3RvcnkoJ3RyZWVWaWV3U2VydmljZScsIHRyZWVWaWV3U2VydmljZSk7XG5cbiAgICBmdW5jdGlvbiB0cmVlVmlld1NlcnZpY2UoJGZpbHRlcikge1xuICAgICAgICB2YXIgc2VsZWN0ZWROb2RlID0gbnVsbDtcbiAgICAgICAgdmFyIG5vZGVzID0gW107XG5cbiAgICAgICAgdmFyIHNlcnZpY2VFeHBvc2FibGUgPSB7XG4gICAgICAgICAgICBzZXRTZWFyY2hlZE5vZGU6IHNldFNlYXJjaGVkTm9kZSxcbiAgICAgICAgICAgIGdldFNlYXJjaGVkTm9kZTogZ2V0U2VhcmNoZWROb2RlLFxuICAgICAgICAgICAgc2V0Tm9kZXM6IHNldE5vZGVzLFxuICAgICAgICAgICAgZ2V0Tm9kZXM6IGdldE5vZGVzLFxuICAgICAgICAgICAgZmluZEJ5SWQ6IGZpbmRCeUlkXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHNlcnZpY2VFeHBvc2FibGU7XG5cbiAgICAgICAgZnVuY3Rpb24gZmluZEJ5SWQoaWQpIHtcbiAgICAgICAgICAgIHZhciB0cmVlTm9kZSA9ICRmaWx0ZXIoJ2ZpbHRlcicpKG5vZGVzLCB7J2lkJzogaWR9LHRydWUpWzBdO1xuICAgICAgICAgICAgcmV0dXJuIHRyZWVOb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gc2V0Tm9kZXMoc2V0T2Zub2Rlcykge1xuICAgICAgICAgICAgbm9kZXMgPSBzZXRPZm5vZGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0Tm9kZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gbm9kZXM7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBzZXRTZWFyY2hlZE5vZGUobm9kZSkge1xuICAgICAgICAgICAgc2VsZWN0ZWROb2RlID0gbm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFNlYXJjaGVkTm9kZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3RlZE5vZGU7XG4gICAgICAgIH1cbiAgICB9XG59KSgpO1xuIl19
