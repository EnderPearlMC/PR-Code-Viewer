/* 

    Code par AUGUSTIN BOUYER

*/

var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");

// State variable
var STATE = "preview";


var COLORS = {
    0: [0, 0, 0],
    1: [237, 0, 0],
    2: [237, 138, 0],
    3: [0, 237, 0], 
    4: [0, 221, 237],
    5: [0, 0, 237],
    6: [237, 0, 229],
    7: [225, 237, 0],
    8: [97, 47, 0],
    9: [163, 0, 217],
    10: [0, 87, 10],
    11: [128, 195, 255],
    12: [224, 177, 177]
}

var penPosition = "up";

var headPos = [0, 0];
var startMovementHeadPos = headPos;
var points = [];
 

var actions = []
var currentAction = 0;

var time = 0;

// cubic bezier constant speed solve
var bezierStarted = false;
var bezierPoints = [];

var fileChosen = false;
var firstDraw = false;

startUpDraw();

var slider = document.getElementById("speed");
var speed = 1;

var sliderChange = false;

slider.oninput = function()
{
    sliderChange = true;
    speed = slider.value;
}

run();

function run()
{
    let interval = setInterval(() => {
		
		if (STATE == "preview")
		{
			if (fileChosen)
			{
				
				let ts = speed;

				if (!firstDraw)
				{
					firstDraw = true;
					ts = 10000;
				}

				for (let s = 0; s < ts; s++)
				{
				
					startUpDraw();

					drawLine();
					
					// draw head
					ctx.fillStyle = "gold";
					ctx.fillRect(headPos[0] * 5 + 100, headPos[1] * 5 + 100, 20, 20);

					// action update
					let act = actions[currentAction];

					determineAction(act);

				}

			}
		}
        if (sliderChange)
        {
            clearInterval(interval);
            run();
        }

    }, 20);
}

function startUpDraw()
{
    canvas.style.imageRendering = "pixelated";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(50, 30, 300, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(30, 50, 10, 300);
    
	if (STATE == "preview")
	{
		ctx.fillStyle = "rgb(146, 146, 146, 0.3)";
		for(var i = 0; i < 100; i++)
		{
			ctx.fillRect(i * 50 + 100, 100, 5, 3000);
			ctx.fillRect(100, i * 50 + 100, 3000, 5);
		}
		document.getElementById("control_a").style.visibility = "visible";
		document.getElementById("control_b").style.visibility = "visible";
		document.getElementById("pr_file_input").style.visibility = "visible";
		document.getElementById("convert_window").style.visibility = "hidden";
	}
	else if (STATE == "convert")
	{
		document.getElementById("control_a").style.visibility = "hidden";
		document.getElementById("control_b").style.visibility = "hidden";
		document.getElementById("pr_file_input").style.visibility = "hidden";
		document.getElementById("convert_window").style.visibility = "visible";
	}
}


// actions

function determineAction(action)
{

    if (action["name"] == "move")
    {
        
        // different actions

        if (action["t"] == "linear")
        {
            move(action["x"], action["y"], action["s"]);
            time += ((action["s"] / 50) / Math.sqrt((action["x"] - startMovementHeadPos[0])**2 + (action["y"] - startMovementHeadPos[1])**2));
        }
        if (action["t"] == "cubic")
        {

            // bezier point repartition anticipation
            if (!bezierStarted)
            {
                for (let t = 0; t < 1; t+=0.001)
                {
                    bezierPoints.push([ cubicReturnPos(action["x"], action["y"], action["ax"], action["bx"], action["ay"], action["by"], t)[0], cubicReturnPos(action["x"], action["y"], action["ax"], action["bx"], action["ay"], action["by"], t)[1], t ])
                }
                bezierStarted = true;
            }

            // find closest point in bezier points
            let closest = 9999999;
            let closestPointId = 0;
            for (let i = 0; i < bezierPoints.length; i++)
            {
                if (Math.abs(bezierPoints[i][2] - time) < closest)
                {
                    closest = Math.abs(bezierPoints[i][2] - time);
                    closestPointId = i; 
                }
            }

            let difference = 0;

            try
            {
                difference = Math.sqrt((bezierPoints[closestPointId + 1][0] - bezierPoints[closestPointId][0])**2 + (bezierPoints[closestPointId + 1][1] - bezierPoints[closestPointId][1])**2);
            }
            catch(e)
            {
                difference = 1;
            }

            cubic(action["x"], action["y"], action["ax"], action["bx"], action["ay"], action["by"], action["s"]);
            time += ((action["s"] / 50) / bezierPoints.length / (difference));
        }

        
        if (time >= 1)
        {
            headPos = [action["x"], action["y"]];
            currentAction += 1;
            startMovementHeadPos = headPos;
            time = 0;
            bezierStarted = false;
            bezierPoints = [];
        }

    }

    if (action["name"] == "tool")
    {
        if ("p" in action)
        {
            penPosition = action["p"];
            currentAction += 1;
        }
    }

}

function move(x, y, s)
{ 

    headPos = [ lerp(startMovementHeadPos[0], x, time), lerp(startMovementHeadPos[1], y, time) ];
}

function cubicReturnPos(x, y, p0x, p1x, p0y, p1y, t)
{
    let Ax = lerp(startMovementHeadPos[0], p0x, t);
    let Ay = lerp(startMovementHeadPos[1], p0y, t);

    let Bx = lerp(p0x, p1x, t);
    let By = lerp(p0y, p1y, t);

    let Cx = lerp(p1x, x, t);
    let Cy = lerp(p1y, y, t);


    let Dx = Ax+(Bx - Ax)*t; 
    let Dy = Ay+(By - Ay)*t; 

    let Ex = Bx+(Cx - Bx)*t; 
    let Ey = By+(Cy - By)*t; 

    let Px = Dx+(Ex - Dx)*t;
    let Py = Dy+(Ey - Dy)*t;

    return [Px, Py];

}

function cubic(x, y, p0x, p1x, p0y, p1y, s)
{ 

    headPos = [ cubicReturnPos(x, y, p0x, p1x, p0y, p1y, time)[0], cubicReturnPos(x, y, p0x, p1x, p0y, p1y, time)[1] ];

}

function lerp(p0, p1, t)
{
    return p0+(p1 - p0)*t;
}

function drawLine()
{
    if (penPosition == "down")
    {
        points.push([headPos[0] * 5, headPos[1] * 5, true]);
    }
    else
    {
        points.push([headPos[0] * 5, headPos[1] * 5, false]);
    }


    // draw points
    ctx.beginPath();
    ctx.lineWidth = "5";
    ctx.fillStyle = "black"
    for (var p = 0; p < points.length; p++)
    {
        if (points[p][2] == true)
        {
        }
        else
        {
            ctx.stroke();
            ctx.beginPath();
        }
        ctx.lineTo(points[p][0] + 100, points[p][1] + 100)
    }
    ctx.stroke();
}

function setActions(act)
{
    actions = act;
    restart();
    firstDraw = false;
    fileChosen = true;
}

function restart()
{
    penPosition = "up";
    points = []
    time = 0;
    currentAction = 0;
    headPos = [0, 0];
    startMovementHeadPos = headPos;
    bezierPoints = [];
    bezierStarted = false;
}