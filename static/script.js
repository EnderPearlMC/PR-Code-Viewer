var canvas = document.getElementById("canvas");

var switch_btn = document.getElementById("switch_mode");

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
var zoom = 1;

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

var colorTable = [];
var toolTakeScript = "";
var toolRemoveScript = "";
var currentTool = "";

/**slider.oninput = function()
{
    sliderChange = true;
    speed = slider.value;
}**/


// boutton pour changer de mode
/**switch_btn.addEventListener("click", () =>{
    if (STATE == "convert")
        {
        STATE = "preview";
    } else STATE = "convert";
    startUpDraw()
})**/

run()

const getColorTableAndScripts = async () => {
    const res = await fetch("http://localhost:3000/get_color_table");
    const colors = await res.json()
    colorTable = colors;
    const res2 = await fetch("http://localhost:3000/get_tool_take_script");
    const script = await res2.json()
    toolTakeScript = script;
    const res3 = await fetch("http://localhost:3000/get_tool_remove_script");
    const script2 = await res3.json()
    toolRemoveScript = script2;
}  

getColorTableAndScripts();

function run()
{
    let interval = setInterval(() => {
		
        // console.log(actions);

		if (STATE == "preview")
		{
			if (fileChosen)
			{
				
				startUpDraw();
				drawLine();
				
				// draw head
				ctx.fillStyle = "gold";
				ctx.fillRect(headPos[0] * 5, headPos[1] * 5, 20, 20);
				// action update
				let act = actions[currentAction];
				determineAction(act);

                console.log("drawing");

			}
		}
        if (sliderChange)
        {
            clearInterval(interval);
            run();
        }

    }, 1);
}

function startUpDraw()
{
    canvas.style.imageRendering = "pixelated";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2ED573";
    ctx.fillRect(30, 735, 100, 10);
    ctx.fillStyle = "#FF6348";
    ctx.fillRect(20, 635, 10, 100);
    
	if (STATE == "preview")
	{
		/**ctx.fillStyle = "rgb(146, 146, 146, 0.3)";
		for(var i = 0; i < 100; i++)
		{
			ctx.fillRect(i * (50 / zoom) + 100, 100, 5 / zoom, 3000);
			ctx.fillRect(100, i * (50 / zoom) + 100, 3000, 5 / zoom);
		}**/
	
	}
	else if (STATE == "convert")
	{
	}
}


// actions

function determineAction(action)
{
    if (!action) {
        return
    }
    if (action["name"] == "move")
    {
        
        // different actions

        if (action["t"] == "linear")
        {
            move(action["x"], action["y"], action["s"]);
            time += (((action["s"] / 50) / Math.sqrt((action["x"] - startMovementHeadPos[0])**2 + (action["y"] - startMovementHeadPos[1])**2))) * 10;
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

    if (action["name"] == "tool_change")
    {
        currentAction += 1;
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
    ctx.lineWidth = (1.5 / zoom).toString();
    ctx.fillStyle = "blue"
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
        ctx.lineTo(points[p][0], points[p][1])
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