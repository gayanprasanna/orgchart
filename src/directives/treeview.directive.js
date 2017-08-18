/**
 * Created by user on 5/30/17.
 */
(function () {
    'use strict';
    angular.module('orgChart').directive('treeView', treeView);

    /*@ngInject*/
    function treeView($filter, $compile, treeViewService, $timeout, toolSetService, $window) {
        var treeViewDirective = {
            replace: 'false',
            restrict: 'E',
            scope: {},
            bindToController: {
                data: '=',
                abn: '&',
                del: '&',
                nodeActions: '@',
                treedata:'='
            },
            controller: TreeViewDirectiveController,
            controllerAs: 'vm',
            link: link
        };

        function link(scope, elem, attrs, vm) {
            //TODO Fetch From the db and add to the service
            /*var treedata = {
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
            };*/

            var nodeBoundaries = {
                width:240,
                height:146,
                horizontalSeperation:16,
                verticalSeperation:128
            };
            var nodeActiveClearListener;
            var nodeDeleteListener;
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
            elem.append($compile("<div layout=\"row\" layout-align=\"space-around center\"><div flex><tree-search-box></tree-search-box></div><div flex><tree-tool-set></tree-tool-set></div></div>")(scope));

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
                // .size([h, w])
                .nodeSize([nodeBoundaries.width+nodeBoundaries.horizontalSeperation, nodeBoundaries.height+nodeBoundaries.verticalSeperation])
                .separation(function separation(a, b) {
                    return a.parent == b.parent ? 1.25 : 1.5;
                });

            var diagonal = d3.svg.diagonal()
/*                .projection(function (d) {
                    return [d.x + 120, d.y + 110];
                });*/
                .source(function (d) {
                    return {
                        "x": d.source.x +(nodeBoundaries.width+nodeBoundaries.horizontalSeperation) / 2,
                        /*"y": d.source.y + 150*/
                        // "x": d.source.x,
                        "y": d.source.y+(nodeBoundaries.height+10)
                    };
                })
                .target(function (d) {
                    return {
                        "x": d.target.x + (nodeBoundaries.width+nodeBoundaries.horizontalSeperation) / 2,
                        /*"y": d.target.y*/
                        // "x": d.target.x,
                        "y": d.target.y-45
                    };
                })
                .projection(function (d) { return [d.x + 0, d.y + 0];
                });
            root = vm.treedata;
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
                    d.y = d.depth * 300;
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

/*                nodeEnter.append("svg:circle")
                    .attr("r", 1e-6)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });*/

                var nodeText = nodeEnter
                    .append("svg:foreignObject")
                    //.attr("y", function(d) { return d.children || d._children ? -10 : 10; })
                    //.attr("dx", ".35em")
                    //.attr("x", function(d) {
                    //  return d.children || d._children ? -10 : 10;
                    //})
/*
                    .attr("y", -30)
                    .attr("x", -5)
*/
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .style("fill-opacity", 1e-6)
                    .attr('width', nodeBoundaries.width)
                    .attr('height', nodeBoundaries.height)
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

                nodeText.append("tree-node").attr("node",function (d) {
                    treeViewService.pushNode(d);
                    return "";
                }).attr("nodeId", function (d) {
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
/*
                angular.copy(nodes, nodeList);

                treeViewService.setNodes(nodeList);*/
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
                var path = searchWithinTree(vm.treedata, node.name, []);

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
            nodeDeleteListener = scope.$on('app:nodes:delete', onNodeDelete);

            function onNodeDelete(ev,data) {
                console.log(data);
            }

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
                nodeActiveClearListener();
                nodeDeleteListener();
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
