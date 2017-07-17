/**
 * Created by user on 6/5/17.
 */
(function () {
    'use strict';

    angular.module('orgChart').factory('toolSetService', toolSetService);

    /*@ngInject*/
    function toolSetService() {

        var isAllExpandedMode = false;
        var LOWEST_ZOOM_SCALE = 1;
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
