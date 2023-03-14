var idleWait = 60; //in seconds, NOT milliseconds
var timer = 0;
var timerIdleState = true;


(function($) {
    $(document).ready(function() {
        $('*').bind('mousemove keydown scroll touchstart touchmove tap swipe mousewheel', function() {
            timerIdleState = false;
        });
    });
})(jQuery)


setInterval(function() {
    if (timerIdleState === true)
        timer++;
    else {
        timer = 0;
        timerIdleState = true;
    }
    if (timer >= idleWait) {
        timer = 0;

        console.log("Inactive fired");
        $("#campusmap_btn").click();
    }
}, 1000);