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
