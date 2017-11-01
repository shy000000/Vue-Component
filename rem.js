/* @charset "utf-8";bower by hexin; */
(function() {
    var designWidth = 750,
        rem2px = 100,
        ua = navigator.userAgent,
        ResetEvent = "onorientationchange" in window ? "orientationchange" : "resize";

    function resetRemSt() {
        var getWidthFn = setInterval(function() {
                if (window.innerWidth != measureWidth) {
                    measureWidth = window.innerWidth
                    remSt.innerHTML = "@media screen and (min-width: " + measureWidth + "px) {html{font-size:" + (measureWidth / (designWidth / rem2px) / defaultFontSize * 100) + "%;}}";
                    clearInterval(getWidthFn)
                }
            }, 50)
    }

    if (ua.indexOf('Hexin_Gphone') > -1) {
        callNativeHandler(
            'webViewFontController',
            '{"fontsize":"1", "switch":"0"}',
            function(data) {}
        );
    }

    var d = window.document.createElement('div');
    var measureWidth = window.innerWidth;
    d.style.width = '1rem';
    d.style.display = 'none';
    var head = window.document.getElementsByTagName('head')[0];
    head.appendChild(d);
    var defaultFontSize = parseFloat(window.getComputedStyle(d, null).getPropertyValue('width'));

    var remSt = document.createElement('style');
    remSt.innerHTML = "@media screen and (min-width: " + measureWidth + "px) {html{font-size:" + (measureWidth / (designWidth / rem2px) / defaultFontSize * 100) + "%;}}";
    head.appendChild(remSt);

    window.addEventListener(ResetEvent, resetRemSt, false);
})()
