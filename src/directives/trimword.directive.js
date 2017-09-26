/**
 * Created by user on 6/23/17.
 */
(function () {
    'use strict';
    angular.module('orgChart').directive('trimWord', trimWord);

    /*@ngInject*/
    function trimWord() {
        var directive = {
            restrict: 'E',
            template: '<span ng-bind="vm.parsedText"><md-tooltip ng-if="vm.isToolTipNeed()" md-direction="vm.wordOptions.toolTipDirection">{{::vm.word}}</md-tooltip></span>',
            scope: {},
            controller: trimWordController,
            controllerAs: 'vm',
            link: link,
            bindToController: {
                wordOptions:'=',
                word:'='
            }
        };

        return directive;

        function link(scope, elem, attr,vm) {

            vm.isToolTipNeed = isToolTipNeed;

            onInit();

            function onInit(){
                activateWatchers();
                parseText();
            }

            function activateWatchers(){
                scope.$watch(angular.bind(vm, function () {
                    return vm.word;
                }), function(value) {
                    console.log('word change to ' + value);
                    parseText();
                });
            }

            function trimWord() {
                var fromValue = parseInt(vm.wordOptions.from);
                var toValue = parseInt(vm.wordOptions.until);
                return vm.word.substring(fromValue, toValue);
            }

            function isToolTipNeed(){
                return vm.wordOptions.toolTip=='true'?true:false
            }

            function parseText(){
                vm.parsedText = trimWord();
                (vm.word.length>parseInt(vm.wordOptions.until))?vm.parsedText = vm.parsedText.concat(" ..."):vm.parsedText;
            }


        }
    }

    /*@ngInject*/
    function trimWordController() {
        var vm = this;

    }
})();
