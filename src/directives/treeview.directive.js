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
            templateNamespace: 'svg',
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
            var dragStarted = false;
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

            vm.wordTrimOptions = {
                word: 'd',
                from: '0',
                until: '12',
                toolTip: 'true',
                toolTipDirection: 'top'
            };

            elem.append($compile("<div class='component-container'><div layout=\"row\" layout-align=\"space-around center\"><div flex><tree-search-box searchable-list='vm.searchableList'></tree-search-box></div><div flex><tree-tool-set zoom-trigger-call-back='vm.zoomTrigger(status)'></tree-tool-set></div></div></div>")(scope));

            vm.zoomTrigger = zoomTrigger;

            /*Listeners*/

            nodeActiveClearListener = scope.$on('app:nodes:clearactive', onDeactivateNodes);
            nodeDeleteListener = scope.$on('app:nodes:delete', onNodeDelete);
            nodeAfterAddListener = scope.$on('app:nodes:add::after', onNodeAfterAdd);
            nodeAfterUpdateListener = scope.$on('app:nodes:update::after', onNodeAfterUpdate);

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
                .on("dragstart", function (d) {
                    if (d == root) {
                        return;
                    }
                    dragStarted = true;
                    nodes = tree.nodes(d);
                    d3.event.sourceEvent.stopPropagation();
                    // it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
                })
                .on("drag", function (d) {
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
                }).on("dragend", function (d) {
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
                vis.selectAll("g.node").sort(function (a, b) { // select the parent and sort the path's
                    if (a.id != draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
                    else return -1; // a is the hovered element, bring "a" to the front
                });
                // if nodes has children, remove the links and nodes
                if (nodes.length > 1) {
                    // remove link paths
                    links = tree.links(nodes);
                    nodePaths = vis.selectAll("path.link")
                        .data(links, function (d) {
                            return d.target.id;
                        }).remove();
                    // remove child nodes
                    nodesExit = vis.selectAll("g.node")
                        .data(nodes, function (d) {
                            return d.id;
                        }).filter(function (d, i) {
                            if (d.id == draggingNode.id) {
                                return false;
                            }
                            return true;
                        }).remove();
                }
                // remove parent link
                parentLink = tree.links(tree.nodes(draggingNode.parent));
                vis.selectAll('path.link').filter(function (d, i) {
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
                    panTimer = setTimeout(function () {
                        pan(domNode, speed, direction);
                    }, 50);
                }
            }

            // Function to update the temporary connector indicating dragging affiliation
            function updateTempConnector() {
                var data = [];
                if (draggingNode !== null && selectedNode !== null) {
                    // have to flip the source coordinates since we did this for the existing connectors on the original tree
                    var extendingValue = (vm.imagepresent) ? 5 : 50;
                    data = [{
                        source: {
                            x: selectedNode.x0 + 12 + (nodeBoundaries.width / 2),
                            y: selectedNode.y0 + 50 + nodeBoundaries.height + 10
                        },
                        target: {
                            x: draggingNode.x0 + 12 + (nodeBoundaries.width / 2),
                            y: draggingNode.y0 + extendingValue
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

            var overInGhostArea = function (d) {
                selectedNode = d;
                updateTempConnector();
            };

            var outOfGhostArea = function (d) {
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
                .append("div")
                .attr("flex", "")
                .attr("id", "svg-box-container")
                .call(function () {
                    // $compile(this[0])(scope);
                })
                .append("svg")
                .attr("id", "svgBox")
                .attr("viewBox", viewBoxBoundary)
                .attr("style", "cursor:move;")
                .attr("width", "100%")
                .attr("height", iHeight)
                .call(zoom)
                .append("svg:g")
                //centering the root node
                .attr("transform", "translate(" + (($window.innerWidth / 2) - 120) + "," + (h / 4) + ")")
                .attr("style", "cursor:pointer;")
                .on("click", stopPropogation, false)
                .call(d3.behavior.drag().on("dragstart", function () {
                }).on("drag", function () {
                }))
                .append("g")
                .attr("width", 160)
                .attr("height", 120)
                .attr("class", "tree-holder");

            d3.selection.prototype.moveToFront = function(){
                return this.each(function () {
                    this.parentNode.appendChild(this);
                });
            };

            var tree = d3.layout.tree()
                .nodeSize([nodeBoundaries.width + nodeBoundaries.horizontalSeperation, nodeBoundaries.height + nodeBoundaries.verticalSeperation])
                .separation(function separation(a, b) {
                    return a.parent == b.parent ? 1.25 : 1.5;
                });


            var diagonal = d3.svg.diagonal()
                .source(function (d) {
                    return {
                        "x": d.source.x + (nodeBoundaries.width) / 2,
                        "y": d.source.y + (nodeBoundaries.height + 10)
                    };
                })
                .target(function (d) {
                    return {
                        "x": d.target.x + (nodeBoundaries.width) / 2,
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

                // Normalize for fixed-depth and dynamic for weight.
                nodes.forEach(function (d) {
                    if (d.weight) {
                        d.y = (d.weight * 12) + d.depth * 300;
                    } else {
                        d.y = d.depth * 300;
                    }

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
                    .attr("height", nodeBoundaries.height + 250)
                    .attr("opacity", 0.2) // change this to zero to hide the target area
                    .style("fill", "transparent")
                    .attr('pointer-events', 'mouseover')
                    .on("mouseover", function (node) {
                        overInGhostArea(node);
                    })
                    .on("mouseout", function (node) {
                        outOfGhostArea(node);
                    });

                nodeEnter.append("tree-node").attr("node", function (d) {
                    treeViewService.pushNode(d);
                    return "";
                })
                    .on("click", onClickedNode)
                    .attr("nodeId", function (d) {
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
                    // .style("stroke-dasharray",("3,3"))
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
                    .attr("d", generatePath);

                // Transition links to their new position.
                link.transition()

                    .duration(duration)
                    .attr("d", generatePath)
                    .style("stroke", function (d) {
                        if (d.target.class === "highlight-link") {
                            this.parentNode.appendChild(this);
                            return "#ff4136";
                        }
                    });

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(0)
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

            function determineNodeRelativeLocation(d) {
                if (d.source.children.length > 1 && d.source.children[0] == d.target) {
                    return 'onleft';
                } else if (d.source.children.length > 1 && d.source.children[d.source.children.length - 1] == d.target) {
                    return 'onright';
                } else {
                    return 'straight';
                }
            }

            function generatePath(d) {
                var relativeLocation = determineNodeRelativeLocation(d);
                var pathString = '';
                var extendingValue = (vm.imagepresent) ? 5 : 50;
                switch (relativeLocation) {
                    case 'straight':
                        pathString += "M"
                            + (d.source.x + (nodeBoundaries.width / 2) + 12)
                            + ","
                            + (d.source.y + nodeBoundaries.height + 57)
                            + "V"
                            + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 35)
                            + "H" + (d.target.x + 12 + ((nodeBoundaries.width) / 2))
                            + "V" + (d.target.y + extendingValue)
                            + "M" + d.target.x + 12 + "," + (d.target.y + extendingValue);
                        break;
                    case 'onleft':
                        pathString += "M"
                            + (d.source.x + (nodeBoundaries.width / 2) + 12)
                            + ","
                            + (d.source.y + nodeBoundaries.height + 57)
                            + "V"
                            + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 35)
                            + "H" + (d.target.x + 12 + ((nodeBoundaries.width) / 2) + 8)
                            + " Q " + ((d.target.x + 12 + ((nodeBoundaries.width) / 2) - 8) + 8) + "," + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 35)
                            + " " + ((d.target.x + 12 + ((nodeBoundaries.width) / 2) - 8) + 8) + "," + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 8 + 35)
                            + "V" + (d.target.y + extendingValue)
                            + "M" + d.target.x + 12 + "," + (d.target.y + extendingValue);
                        break;
                    case 'onright':
                        pathString += "M"
                            + (d.source.x + 12 + (nodeBoundaries.width / 2))
                            + ","
                            + (d.source.y + nodeBoundaries.height + 57)
                            + "V"
                            + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 35)
                            + "H" + (d.target.x + 12 + ((nodeBoundaries.width) / 2) - 8)
                            + " Q " + ((d.target.x + 12 + ((nodeBoundaries.width) / 2)) ) + "," + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 35)
                            + " " + ((d.target.x + 12 + ((nodeBoundaries.width) / 2))) + "," + (d.source.y + nodeBoundaries.height + (nodeBoundaries.height / 2) + 8 + 35)
                            + "V" + (d.target.y + extendingValue)
                            + "M" + d.target.x + 12 + "," + (d.target.y + extendingValue);
                        break;
                }

                return pathString;
            }

            function saveAsPDF() {
                var svg = document.getElementById("svg-box-container").innerHTML;
                if (vis) {
                    svg = svg.replace(/\r?\n|\r/g, '').trim();
                }


                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');


                context.clearRect(0, 0, canvas.width, canvas.height);
                canvg(canvas, svg);


                var imgData = canvas.toDataURL('image/png');

                // Generate PDF
                var doc = new jsPDF('p', 'pt', 'a4');
                doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
                doc.save('test.pdf');
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
                    value.class = 'highlight-link';
                    if (value._children) {
                        value.children = value._children;
                        value._children = null;
                    }
                    update(value);
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
                var scale = toolSetService.getZoomScale();
                var translate = [-scale * node.x, -scale * node.y];
                console.log('node', node);
                console.log('node translate ', translate);
                vis.transition()
                    .duration(1250)
                    .call(zoom.translate(translate).scale(scale).event);
            }


            function reset() {
                console.log("Resetting Active nodes");
                active.classed("active", false);
                active = d3.select(null);

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
            }

            function zoomed() {
                console.log(zoom.scale());
                toolSetService.setZoomScale(zoom.scale());
                vis.attr("transform",
                    "translate(" + zoom.translate() + ")" +
                    "scale(" + toolSetService.getZoomScale() + ")"
                );

                vis.selectAll("g.parent")
                    .attr("transform", function (d) {
                        return "translate(" + d.x + "," + d.y + ")"
                            + "scale(" + toolSetService.getZoomScale() + ")"
                    });
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
    function TreeViewDirectiveController($scope) {
        var vm = this;
        vm.makeCallBack = makeCallBack;

        console.log(vm.searchableList);

        function makeCallBack(identifier, node) {
            $scope.vm[identifier]({node: node});
        }

    }
})();
