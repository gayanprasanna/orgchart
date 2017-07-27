/**
 * Created by user on 7/21/17.
 */
(function () {
    'use strict';
    angular.module('orgChart.example').config(orgchartRouteConfig);

    /*@ngInject*/
    function orgchartRouteConfig($stateProvider) {
        $stateProvider.state('example.test', {
            url: '/example/test',
            controller: 'ExampleOrgChartController',
            templateUrl: 'app/example/test/test.tmpl.html',
            controllerAs: 'vm',
            data: {
                permissions: {
                    only: ['fullAccess']
                }
            }
        })
    }
})();