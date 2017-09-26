/**
 * Created by Gayan Prasanna on 5/30/17.
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
                add: '&',
                edit: '&',
                nodeActions: '@',
                treedata: '=',
                searchableList: '=',
                imagepresent: '='
            },
            controller: TreeViewDirectiveController,
            controllerAs: 'vm',
            link: {
                pre: link
            }
        };

        function link(scope, elem, attrs, vm) {

            var nodeBoundaries = {
                width: 240,
                height: 146,
                horizontalSeperation: 16,
                verticalSeperation: 128
            };
            var dragStarted=false;
            var nodes;
            var domNode;
            var relCoords;
            var panTimer;
            // variables for drag/drop
            var selectedNode = null;
            var draggingNode = null;
            // panning variables
            var panSpeed = 200;
            var panBoundary = 20; // Within 20px from edges will pan when dragging.
            var translateCoords;
            var links;
            var nodePaths;
            var nodesExit;
            var parentLink;

            var nodeActiveClearListener;
            var nodeDeleteListener;
            var nodeAfterAddListener;
            var nodeAfterUpdateListener;
            var dragListener;
            var nodeList = [];
            var m = [20, 20, 20, 20],
                w = $window.innerWidth - 20 - m[1] - m[3],
                iHeight = $window.innerHeight,
                h = 600 - m[0] - m[2],
                i = 0,
                r = 800,
                x = d3.scale.linear().domain([0, w]).range([0, w]),
                y = d3.scale.linear().domain([0, h]).range([0, h]),
                root;
            var viewBoxBoundary = '0 0 ' + w + " " + iHeight;
            var wrapperElement = d3.select(elem[0]);
            var lastSearchedPath = [];

            var zoom = d3.behavior.zoom()
                .translate([0, 0])
                .scale(toolSetService.getZoomScale())
                .scaleExtent([0.3, 8])
                .on("zoom", zoomed);
            /*
                        var zoomObject = d3.behavior.zoom()
                            .translate([0, 0])
                            .scale(toolSetService.getZoomScale())
                            .scaleExtent([0.3, 8])
                            .on("zoom", zoomedWrapper);*/

            // zoom();
            elem.append($compile("<div class='component-container'><div layout=\"row\" layout-align=\"space-around center\"><div flex><tree-search-box searchable-list='vm.searchableList'></tree-search-box></div><div flex><tree-tool-set zoom-trigger-call-back='vm.zoomTrigger(status)'></tree-tool-set></div></div></div>")(scope));

            vm.zoomTrigger = zoomTrigger;


            function zoomTrigger(status) {
                console.log(status);
                zoomClick(status);
            }

            function onInit() {
                activateWatchers();
            }


            function activateWatchers() {
                onSearchWatch();
                // onZoomWatch();
                onExpandWatch();
            }

            function onExpandWatch() {
                scope.$watch(function () {
                    return toolSetService.isExpandAllMode()
                }, function (isInExpandAllMode) {
                    if (isInExpandAllMode) {
                        expandAllInChain();
                    } else {
                        collapseAllInChain();
                    }
                })
            }

            function expandAllInChain() {
                forceScale(0.5);
                toolSetService.setZoomScale(0.5);
                centerTheRoot();
                // forceZoom();
                expandAll();
            }

            function collapseAllInChain() {
                forceScale(1);
                toolSetService.setZoomScale(1);
                centerTheRoot();
                /*                forceZoom();*/
                collapseAll();
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

            function forceZoom() {
                var zoomScale = toolSetService.getZoomScale();
                console.log(zoomScale);
                vis.transition()
                    .duration(750)
                    .call(zoomObject.translate([0, 0]).scale(zoomScale).scaleExtent([0.3, 8]).event);

            }

            function forceScale(scale) {
                var view = {
                    x: 0,
                    y: 0,
                    k: scale
                };
                interpolateZoom([view.x, view.y], view.k);
            }

            // Define the drag listeners for drag/drop behaviour of nodes.
            dragListener = d3.behavior.drag()
                .on("dragstart", function(d) {
                    if (d == root) {
                        return;
                    }
                    dragStarted = true;
                    nodes = tree.nodes(d);
                    d3.event.sourceEvent.stopPropagation();
                    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                })
                .on("drag", function(d) {
                    if (d == root) {
                        return;
                    }
                    if (dragStarted) {
                        domNode = this;
                        initiateDrag(d, domNode);
                    }
                    // get coords of mouseEvent relative to svg container to allow for panning
                    relCoords = d3.mouse($('svg').get(0));
                    if (relCoords[0] < panBoundary) {
                        panTimer = true;
                        pan(this, 'left');
                    } else if (relCoords[0] > ($('svg').width() - panBoundary)) {
                        panTimer = true;
                        pan(this, 'right');
                    } else if (relCoords[1] < panBoundary) {
                        panTimer = true;
                        pan(this, 'up');
                    } else if (relCoords[1] > ($('svg').height() - panBoundary)) {
                        panTimer = true;
                        pan(this, 'down');
                    } else {
                        try {
                            clearTimeout(panTimer);
                        } catch (e) {
                            console.error(e);
                        }
                    }

                    d.x0 += d3.event.dx;
                    d.y0 += d3.event.dy;

                    var node = d3.select(this);

                    node.attr("transform", "translate(" + d.x0 + "," + d.y0 + ")");
                    updateTempConnector();
                }).on("dragend", function(d) {
                    if (d == root) {
                        return;
                    }
                    domNode = this;
                    if (selectedNode) {
                        // now remove the element from the parent, and insert it into the new elements children
                        var index = draggingNode.parent.children.indexOf(draggingNode);
                        if (index > -1) {
                            draggingNode.parent.children.splice(index, 1);
                        }
                        if (typeof selectedNode.children !== 'undefined' || typeof selectedNode._children !== 'undefined') {
                            if (typeof selectedNode.children !== 'undefined') {
                                selectedNode.children.push(draggingNode);
                            } else {
                                selectedNode._children.push(draggingNode);
                            }
                        } else {
                            selectedNode.children = [];
                            selectedNode.children.push(draggingNode);
                        }
                        // Make sure that the node being added to is expanded so user can see added node is correctly moved
                        /*                        expand(selectedNode);
                                                sortTree();*/
                        endDrag();
                    } else {
                        endDrag();
                    }
                });
            function initiateDrag(d, domNode) {
                draggingNode = d;
                d3.select(domNode).select('.ghost-area').attr('pointer-events', 'none');
                d3.selectAll('.ghost-area').attr('class', 'ghost-area show');
                d3.select(domNode).attr('class', 'node active-drag');
                vis.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
                    if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                    else return -1; // a is the hovered element, bring "a" to the front
                });
                // if nodes has children, remove the links and nodes
                if (nodes.length > 1) {
                    // remove link paths
                    links = tree.links(nodes);
                    nodePaths = vis.selectAll("path.link")
                        .data(links, function(d) {
                            return d.target.id;
                        }).remove();
                    // remove child nodes
                    nodesExit = vis.selectAll("g.node")
                        .data(nodes, function(d) {
                            return d.id;
                        }).filter(function(d, i) {
                            if (d.id == draggingNode.id) {
                                return false;
                            }
                            return true;
                        }).remove();
                }
                // remove parent link
                parentLink = tree.links(tree.nodes(draggingNode.parent));
                vis.selectAll('path.link').filter(function(d, i) {
                    if (d.target.id == draggingNode.id) {
                        return true;
                    }
                    return false;
                }).remove();
                dragStarted = null;
            }
            function pan(domNode, direction) {
                var speed = panSpeed;
                var translateX;
                var translateY;
                var scaleX;
                var scaleY;
                var scale;
                if (panTimer) {
                    clearTimeout(panTimer);
                    translateCoords = d3.transform(vis.attr("transform"));
                    if (direction == 'left' || direction == 'right') {
                        translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                        translateY = translateCoords.translate[1];
                    } else if (direction == 'up' || direction == 'down') {
                        translateX = translateCoords.translate[0];
                        translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
                    }
                    scaleX = translateCoords.scale[0];
                    scaleY = translateCoords.scale[1];
                    scale = toolSetService.getZoomScale();
                    vis.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
                    d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
                    zoom.scale(scale);
                    zoom.translate([translateX, translateY]);
                    panTimer = setTimeout(function() {
                        pan(domNode, speed, direction);
                    }, 50);
                }
            }
            // Function to update the temporary connector indicating dragging affiliation
            var updateTempConnector = function() {
                var data = [];
                if (draggingNode !== null && selectedNode !== null) {
                    // have to flip the source coordinates since we did this for the existing connectors on the original tree
                    data = [{
                        source: {
                            x: selectedNode.x0 +(nodeBoundaries.width/2),
                            y: selectedNode.y0+nodeBoundaries.height+10
                        },
                        target: {
                            x: draggingNode.x0+(nodeBoundaries.width/2),
                            y: draggingNode.y0
                        }
                    }];
                }
                var link = vis.selectAll(".temp-link").data(data);
                link.enter().append("path")
                    .attr("class", "temp-link")
                    .attr("d", d3.svg.diagonal())
                    .attr('pointer-events', 'none');
                link.attr("d", d3.svg.diagonal());
                link.exit().remove();
            };

            var overInGhostArea = function(d) {
                selectedNode = d;
                updateTempConnector();
            };

            var outOfGhostArea = function(d) {
                selectedNode = null;
                updateTempConnector();
            };

            function endDrag() {
                selectedNode = null;
                d3.selectAll('.ghost-area').attr('class', 'ghost-area');
                d3.select(domNode).attr('class', 'node');
                // now restore the mouseover event or we won't be able to drag a 2nd time
                d3.select(domNode).select('.ghost-area').attr('pointer-events', '');
                updateTempConnector();
                if (draggingNode !== null) {
                    update(root);
                    panToTheNode(draggingNode);
                    draggingNode = null;
                }
            }

            onInit();

            var vis = wrapperElement.append("div")
                .attr("layout", "row")
                .attr("layout-align", "space-around center")
                .call(function () {
                    // $compile(this[0])(scope);
                })
                .append("div").attr("flex", "").call(function () {
                    // $compile(this[0])(scope);
                })
                .append("svg:svg")
                .attr("viewBox", viewBoxBoundary)
                .attr("style","cursor:move;")
                .attr("width", "100%")
                .attr("height", iHeight)
                /*                .call(d3.behavior.zoom().on("zoom", function () {
                                    toolSetService.setZoomScale(d3.event.scale);
                                    scope.$apply();
                                    console.log(d3.event.scale);
                                    if(d3.event.scale>0.5){
                                        // vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
                                    }

                                    // vis.attr("transform", "translate(" + d3.event.translate + ")");
                                }))*/
                .call(zoom)
                // .call(zoomObject)
                .append("svg:g")
                //.attr("pointer-events", "all")
                //centering the root node
                .attr("transform", "translate(" + (($window.innerWidth / 2) - 120) + "," + (h / 4) + ")")
                .attr("style", "cursor:pointer;")
                //.call(d3.behavior.zoom().scaleExtent([1,8]).on("zoom",zoom));
                //.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on
                .on("click", stopPropogation, false)
                .call(d3.behavior.drag().on("dragstart", function () {
                    // d3.event.sourceEvent.stopPropagation();
                    /*         vis.transition()
                             //duration of the animation of transition
                                 .duration(0)
                                 // delay time in ms
                                 .delay(0)
                                 .attr("transform", function (d) {
                                     return "scale(" + toolSetService.getZoomScale() + ")";
                                 });
         */
                }).on("drag", function () {
                    console.log("dragged");
                    // d3.event.sourceEvent.stopPropagation();
                }))
                .append("g").attr("width", 160).attr("height", 120).attr("class", "tree-holder")/*.call(d3.behavior.drag().on("dragstart", function () {
             d3.event.sourceEvent.stopPropagation();
             }).on("drag", function () {
             console.log("dragged");
             }))*/;


            var tree = d3.layout.tree()
            // .size([h, w])
                .nodeSize([nodeBoundaries.width + nodeBoundaries.horizontalSeperation, nodeBoundaries.height + nodeBoundaries.verticalSeperation])
                .separation(function separation(a, b) {
                    return a.parent == b.parent ? 1.25 : 1.5;
                });

            var line = d3.svg.line()

                .x(function (d) {
                    return xScale(d.x);
                })
                .y(function (d) {
                    return yScale(d.y);
                });

            function fetchLineData() {
                var source = {
                    "x": d.source.x + (nodeBoundaries.width) / 2,
                    "y": d.source.y + (nodeBoundaries.height + 10)
                };
                var target = {
                    "x": d.target.x + (nodeBoundaries.width) / 2,
                    "y": d.target.y - (attrs.imagepresent == 'true' ? 45 : 0)
                };

                var lineDataArray = [];
                lineDataArray.push(source);
                lineDataArray.push(target);

                return lineDataArray;
            }

            var diagonal = d3.svg.diagonal()
            /*                .projection(function (d) {
                                return [d.x + 120, d.y + 110];
                            });*/
                .source(function (d) {
                    return {
                        "x": d.source.x + (nodeBoundaries.width) / 2,
                        /*"y": d.source.y + 150*/
                        // "x": d.source.x,
                        "y": d.source.y + (nodeBoundaries.height + 10)
                    };
                })
                .target(function (d) {
                    return {
                        "x": d.target.x + (nodeBoundaries.width) / 2,
                        /*"y": d.target.y*/
                        // "x": d.target.x,
                        "y": d.target.y - (attrs.imagepresent == 'true' ? 45 : 0)
                    };
                })
                .projection(function (d) {
                    return [d.x + 0, d.y + 0];
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
                    .call(dragListener)
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
                    });

                nodeEnter.append("rect")
                    .attr('class', 'ghost-area')
                    .attr("width", nodeBoundaries.width)
                    .attr("height", nodeBoundaries.height+150)
                    .attr("opacity", 0.2) // change this to zero to hide the target area
                    .style("fill", "transparent")
                    .attr('pointer-events', 'mouseover')
                    .on("mouseover", function(node) {
                        overInGhostArea(node);
                    })
                    .on("mouseout", function(node) {
                        outOfGhostArea(node);
                    });

                var nodeText = nodeEnter
                    .append("svg:foreignObject")
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .style("fill-opacity", 1e-6)
                    // .style("overflow", "visible")
                    // .classed("of",function(){return true;})
                    .attr('width', nodeBoundaries.width)
                    .attr('height', nodeBoundaries.height)
                    .append('xhtml:div')
                    .classed("disabled", function (d) {
                        return d.enable !== undefined && !d.enable;
                    }).on("click", onClickedNode)/*.call(d3.behavior.drag().on("dragstart", function () {
                 d3.event.sourceEvent.stopPropagation();
                 }).on("drag", function () {
                 console.log("dragged");
                 }))*/;

                nodeText.append("tree-node").attr("node", function (d) {
                    treeViewService.pushNode(d);
                    return "";
                }).attr("nodeId", function (d) {
                    return d.id;
                }).attr("imagePresent", function (d) {
                    return vm.imagepresent;
                }).attr("isPinnedNode", "false").attr("nodeActions", attrs.nodeactions)
                    .each(function () {
                        $compile(this)(scope);
                    });

                // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")";
                    });
                /*
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
                                    .style("fill-opacity", 1);*/

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
                /*                    .attr("d", function (d) {
                                        return "M" + d.source.y + "," + d.source.x
                                            + "C" + (d.target.y + 100) + "," + d.source.x
                                            + " " + (d.target.y + 100) + "," + d.target.x
                                            + " " + d.target.y + "," + d.target.x;
                                    });*/

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
//             function zoom(d) {
//                 //vis.attr("transform", "transl3ate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
//                 var nodes = vis.selectAll("g.node");
//                 nodes.attr("transform", transform);
//
//                 // Update the links...
//                 var link = vis.selectAll("path.link");
//                 link.attr("d", translate);
//
//                 // Enter any new links at hte parent's previous position
//                 //link.attr("d", function(d) {
//                 //      var o = {x: d.x0, y: d.y0};
//                 //      return diagonal({source: o, target: o});
//                 //    });
//             }

            function determineNodeRelativeLocation(d) {
                if (d.source.x == d.target.x) {
                    return 'straight';
                } else if (d.source.x > d.target.x) {
                    return 'onleft';
                } else {
                    return 'onright';
                }
            }

            function generatePath(d) {
                var relativeLocation = determineNodeRelativeLocation(d);
                var pathString = '';

                switch (relativeLocation) {
                    case 'straight':
                        pathString += "M " + d.source.x + "," + d.source.y
                            + " L " + d.source.x + "," + (d.target.y - d.source.y)
                            + " M " + d.source.x + "," + (d.target.y - d.source.y);
                        break;
                    case 'onleft':
                        pathString += "M " + d.source.x + "," + d.source.y
                            + " L " + d.source.x + "," + (d.source.y + 10)
                            + " Q " + d.source.x + "," + ((d.source.y + 10) + 8)
                            + " " + (d.source.x - 8) + "," + ((d.source.y + 10) + 8)
                            + " L " + ((d.source.x - 8) - ((d.target.x - d.source.x) - 120)) + "," + ((d.source.y + 10) + 8)
                            + " Q " + (((d.source.x - 8) - ((d.target.x - d.source.x) - 120)) - 8) + "," + ((d.source.y + 10) + 8)
                            + " " + (((d.source.x - 8) - ((d.target.x - d.source.x) - 120)) - 8) + "," + (((d.source.y + 10) + 8) + 8)
                            + " L " + (((d.source.x - 8) - ((d.target.x - d.source.x) - 120)) - 8) + "," + ((d.target.y - d.source.y))
                            /*+ "C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
                            + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y*/
                            // + " M " + (((d.source.x - 8) - ((d.target.x-d.source.x)-120)) - 8) + "," + ((d.target.y-d.source.y));
                            + " M " + d.target.x + "," + d.target.y;
                        break;
                    case 'onright':
                        pathString += "M " + d.source.x + "," + d.source.y
                            + " L " + d.source.x + "," + (d.source.y + 10)
                            + " Q " + d.source.x + "," + ((d.source.y + 10) + 8)
                            + " " + (d.source.x + 8) + "," + ((d.source.y + 10) + 8)
                            + " L " + ((d.source.x + 8) - ((d.target.x - d.source.x) - 120)) + "," + ((d.source.y + 10) + 8)
                            + " Q " + (((d.source.x + 8) - ((d.target.x - d.source.x) - 120)) + 8) + "," + ((d.source.y + 10) + 8)
                            + " " + (((d.source.x + 8) - ((d.target.x - d.source.x) - 120)) + 8) + "," + (((d.source.y + 10) + 8) + 8)
                            + " L " + (((d.source.x + 8) - ((d.target.x - d.source.x) - 120)) + 8) + "," + ((d.target.y - d.source.y))
                            /*+ "C" + (d.source.x + d.target.x) / 2 + "," + d.source.y
                            + " " + (d.source.x + d.target.x) / 2 + "," + d.target.y*/
                            + " M " + (((d.source.x + 8) - ((d.target.x - d.source.x) - 120)) + 8) + "," + ((d.target.y - d.source.y));
                        break;
                }

                return pathString;
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

            function onAddNode(parent, child) {
                var length = 9;
                var id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, length);
                addChildNode(parent.id, child);
                // stopPropogation();
            }

            function onRemoveNode(d) {
                var index = d.parent.children.indexOf(d);
                if (index > -1) {
                    d.parent.children.splice(index, 1);
                }
                findIntheRootAndDestoroy(root.children, d);
                update(d.parent);
                stopPropogation();
            }

            function findIntheRootAndDestoroy(list, node) {
                angular.forEach(list, function (value, key) {

                    if (node.id == value.id) {
                        var index = list.indexOf(value);
                        if (index > -1) {
                            list.splice(index, 1);
                        }
                    } else if (angular.isDefined(value.children) && value.children !== null) {
                        findIntheRootAndDestoroy(value.children, node);
                    }
                });
            }

            function findIntheRootAndReplaceName(list, node) {
                angular.forEach(list, function (value, key) {

                    if (node.id == value.id) {
                        var index = list.indexOf(value);
                        if (index > -1) {
                            list[index].name = node.name;
                        }
                    } else if (angular.isDefined(value.children) && value.children !== null) {
                        findIntheRootAndDestoroy(value.children, node);
                    }
                });
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
                } else if (nodeData._children == null) {
                    nodeData._children = [];
                    nodeData._children.push(newNode);
                    toggle(nodeData);
                }
                update(nodeData);

                // stopPropogation();
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
                // var scale = 1;//FIXME add scale to higher if need
                var scale = toolSetService.getZoomScale();
                var translate = [-scale * node.x, -scale * node.y];
                console.log('node', node);
                console.log('node translate ', translate);
                vis.transition()
                    .duration(1250)
                    .call(zoom.translate(translate).scale(scale).event);
            }


            function zoomedWrapper() {
                // g.style("stroke-width", 1.5 / d3.event.scale + "px");
                vis.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function reset() {
                console.log("reset called");
                active.classed("active", false);
                active = d3.select(null);

                //TODO remove ASAP
                /*                vis.transition()
                                    .duration(750)
                                    .call(zoomObject.translate([150, 100]).scale(1).event);*/

                return true;
            }

            function getTreeNodeByObject(object) {
                var treeNode = $filter('filter')(nodeList, {'id': object.id}, true)[0];
                return treeNode;
            }

            function getTreeNodeByID(id) {
                var treeNode = $filter('filter')(nodeList, {'id': id}, true)[0];
                return treeNode;
            }

            function centerTheRoot() {
                //Transform to the center (0,0)
                transformNode(0, 0);
            }

            function transformNode(xPos, yPos) {
                vis.transition()
                //duration of the animation of transition
                    .duration(1000)
                    // delay time in ms
                    .delay(100)
                    .attr("transform", function (d) {
                        return "translate(" + (xPos) + "," + (yPos) + ")"
                            + "scale(" + toolSetService.getZoomScale() + ")";
                    });
            }

            nodeActiveClearListener = scope.$on('app:nodes:clearactive', onDeactivateNodes);
            nodeDeleteListener = scope.$on('app:nodes:delete', onNodeDelete);
            nodeAfterAddListener = scope.$on('app:nodes:add::after', onNodeAfterAdd);
            nodeAfterUpdateListener = scope.$on('app:nodes:update::after', onNodeAfterUpdate);

            function onNodeAfterUpdate(ev, data) {
                findIntheRootAndReplaceName(root.children, data.lastEditedNode);
                update(data.lastEditedNode);
                stopPropogation();
            }

            function onNodeAfterAdd(ev, data) {
                var resolvedNode = getTreeNodeByID(data.parentNode.id);
                onAddNode(resolvedNode, data.lastAddedNode);
            }

            function onNodeDelete(ev, data) {
                console.log(data);
                var resolvedNode = getTreeNodeByID(data.nodeID);
                onRemoveNode(resolvedNode);
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

            function interpolateZoom(translate, scale) {
                return d3.transition().duration(250).tween("wheel.zoom", function () {
                    var iTranslate = d3.interpolate(zoom.translate(), translate),
                        iScale = d3.interpolate(zoom.scale(), scale);
                    return function (t) {
                        zoom
                            .scale(iScale(t))
                            .translate(iTranslate(t));
                        zoomed();
                    };
                });
            }

            function zoomClick(status) {
                var direction = 1,
                    factor = 0.2,
                    target_zoom = 1,
                    center = [w / 2, h / 2],
                    extent = zoom.scaleExtent(),
                    translate = zoom.translate(),
                    translate0 = [],
                    l = [],
                    view = {x: translate[0], y: translate[1], k: zoom.scale()};

                // d3.event.preventDefault();
                direction = (status === 'increment') ? 1 : -1;
                target_zoom = zoom.scale() * (1 + factor * direction);

                if (target_zoom < extent[0] || target_zoom > extent[1]) {
                    return false;
                }

                translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
                view.k = target_zoom;
                l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

                view.x += center[0] - l[0];
                view.y += center[1] - l[1];

                interpolateZoom(zoom.translate(), view.k);
                // zoomed();
            }

            function zoomed() {
                console.log(zoom.scale());
                toolSetService.setZoomScale(zoom.scale());
                vis.attr("transform",
                    "translate(" + zoom.translate() + ")" +
                    "scale(" + toolSetService.getZoomScale() + ")"
                    // "scale(" + zoom.scale() + ")"
                );
                // zoomWithTween();
            }

            function zoomWithTween(){
                vis.transition()
                    .attr("transform", "translate(" + zoom.translate() + ")scale(" + toolSetService.getZoomScale() + ")");
                /*                    .each("end", function () {
                                        // interpolateZoom(zoom.translate(),zoom.scale());
                                    });*/
            }

            scope.$on('$destroy', destroyListener);

            function destroyListener() {
                nodeActiveClearListener();
                nodeDeleteListener();
                nodeAfterAddListener();
                nodeAfterUpdateListener();
            }
        }

        return treeViewDirective;
    }

    /*@ngInject*/
    function TreeViewDirectiveController($rootScope, $scope, treeViewService) {
        var vm = this;
        vm.makeCallBack = makeCallBack;

        console.log(vm.searchableList);

        function makeCallBack(identifier, node) {
            console.log('called treeview call back abn');
            $scope.vm[identifier]({node: node});
        }

    }
})();
