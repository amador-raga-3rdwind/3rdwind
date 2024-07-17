// Global variables
    var clock_face = null,
	hour_hand = null,
	minute_hand = null,
	second_hand = null,
	ctx = null,
	metric_ctx = null,
	degrees = 0,
	ball=null, ball2=null;


    var dimension  = 500;
    var hours = 0;
    var minutes = 0;
    var seconds = 0;
    var metric_hours = 0;
    var metric_minutes = 0;
    var metric_seconds = 0;
    var ms = 0;

function clearCanvas() {
	 // clear canvas
    ctx.clearRect(0, 0, dimension, dimension);
    metric_ctx.clearRect(0, 0, dimension, dimension);
}

function getRequiredMinuteAngle() {
	// Calculate the expected angle
	return Math.floor(((360 / 60) * (minutes + seconds/60) ), 0);
}

function getRequiredHourAngle() {
	// Calculate the expected angle
	return Math.floor(((360 / 12) * ( hours + minutes /60 ) ), 0);
}

function getRequiredSecondAngle() {
    // Calculate the expected angle
    var sec = Math.floor(((360 / 60) * (seconds)), 0);
  return sec ;
}

function rotateAndDraw(image, angle) {
	// Rotate around this point
	ctx.rotate(angle * (Math.PI / 180));
    // Draw the image back and up
	ctx.drawImage(image, 0 - dimension / 2, 0 - dimension / 2);
    ctx.rotate(-angle * (Math.PI / 180));

}


function rotateAndDraw_Metric(image, angle) {
    metric_ctx.rotate(angle * (Math.PI / 180));
    // Draw the image back and up
    metric_ctx.drawImage(image, 0 - dimension / 2, 0 - dimension / 2);
    metric_ctx.rotate(-angle * (Math.PI / 180));
}



function getRequiredMinuteAngle_Metric() {
    return Math.floor( (metric_minutes + metric_seconds/100) * 3.6, 0);
}

function getRequiredHourAngle_Metric() {
    return Math.floor( 36 * (metric_hours + metric_minutes / 100), 0);
}

function getRequiredSecondAngle_Metric() {
    return Math.floor( metric_seconds * 3.6 , 0);
}


function correctDisplay(obj)
{
    if (obj<=9) obj = "0" + obj;
    return obj;
}


    function draw() {
        var currentTime = new Date();
        hours = currentTime.getHours();
        minutes = currentTime.getMinutes();
        seconds = currentTime.getSeconds();
        ms = currentTime.getMilliseconds();
        clearCanvas();

        num_seconds = (ms / 1000) + seconds + (minutes * 60) + (hours * 3600);
        metric_numseconds = num_seconds * 100000/86400 + "";
        document.getElementById('digital_clock').innerHTML = hours + ":" + correctDisplay(minutes) + ":" + correctDisplay(seconds); // + "." + ms;
        // + "<br>" + num_seconds + "<br>" + metric_numseconds ;

        metric_format = metric_numseconds.split(".");
        metric_numseconds = parseInt(metric_format[0]);

        metric_hours = parseInt(metric_numseconds / 10000);

        //parse the Metric Number of Seconds to Hours/Minutes/Seconds
        metric_seconds = "" +(metric_numseconds - (metric_hours * 10000));
        metric_minutes = metric_seconds.substring(0, 2);
        metric_seconds = metric_seconds.substring(4, 2);
        document.getElementById('digital_clock_metric').innerHTML = metric_hours+ "|" + metric_minutes + "|" +  metric_seconds;




        // Draw the clock onto the canvas
        ctx.drawImage(clock_face, 0, 0);
        metric_ctx.drawImage(clock_face, 0, 0);

        // Save the current drawing state
        ctx.save();
        metric_ctx.save();

        // Now move across and down half way
        ctx.translate(dimension / 2, dimension / 2);
        metric_ctx.translate(dimension / 2, dimension / 2);

        rotateAndDraw(minute_hand, getRequiredMinuteAngle());
        rotateAndDraw(hour_hand, getRequiredHourAngle());
        rotateAndDraw(second_hand, getRequiredSecondAngle()  );
        rotateAndDraw_Metric(minute_hand, getRequiredMinuteAngle_Metric());
        rotateAndDraw_Metric(hour_hand, getRequiredHourAngle_Metric());
        rotateAndDraw_Metric(second_hand, getRequiredSecondAngle_Metric());

        // Restore the previous drawing state
        ctx.restore();
        metric_ctx.restore();
    }

    function imgLoaded() {
        // Image loaded event complete.  Start the timer
        setInterval(draw, 100);
    }

    function init() {

	
        document.getElementById('clock').width = dimension;
        document.getElementById('clock').height = dimension;
        document.getElementById('metric_clock').width = dimension;
        document.getElementById('metric_clock').height = dimension;

        // Grab the clock element
        var canvas = document.getElementById('clock');
        var metric_canvas = document.getElementById('metric_clock');

        // Canvas supported?
        if (canvas.getContext('2d')) {
            ctx = canvas.getContext('2d');
            metric_ctx = metric_canvas.getContext('2d');  /// the contect for the Metric Clock

            // Load the hor hand image
            hour_hand = new Image();
            hour_hand.src = 'hour_hand.png';

            // Load the minute hand image
            minute_hand = new Image();
            minute_hand.src = 'minute_hand.png';

            // Load the minute hand image
            second_hand = new Image();
            second_hand.src = 'second_hand2.png';

            ball = new Image();
            ball.src = 'ball.png';

            // Load the clock face image
            clock_face = new Image();
            clock_face.src = 'clock_face.png';
            clock_face.onload = imgLoaded;

        } else {
            alert("Canvas not supported!");
        }
    }