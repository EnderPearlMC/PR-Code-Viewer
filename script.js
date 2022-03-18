var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");



var headPos = [0, 0];
var startMovementHeadPos = [0, 0];
var points = [];
 

var actions = [ 
    {
        "name": "tool",
        "t": "felt",
        "p": "down" 
    },
    {
        "name": "move",
        "x": 0,
        "y": 100,
        "s": 100,
        "t": "linear"
    },
    {
        "name": "move",
        "x": 100,
        "y": 100,
        "s": 100,
        "t": "cubic",
        "ax": 0,
        "ay": 150,
        "bx": 100,
        "by": 150
    },
    {
        "name": "tool",
        "t": "felt",
        "p": "up" 
    }
]
var currentAction = 0;

startMovementHeadPos = headPos;

var time = 0;

setInterval(() => {
    canvas.style.imageRendering = "pixelated";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.fillRect(50, 30, 300, 10);
    ctx.fillStyle = "green";
    ctx.fillRect(30, 50, 10, 300);
    
    ctx.fillStyle = "rgb(146, 146, 146, 0.3)";
    for(var i = 0; i < 100; i++)
    {
        ctx.fillRect(i * 50 + 100, 100, 5, 3000);
        ctx.fillRect(100, i * 50 + 100, 3000, 5);
    }



    points.push([headPos[0] * 5, headPos[1] * 5]);

    ctx.fillStyle = "black";
    // draw points
    ctx.beginPath();
    ctx.lineWidth = "5";
    for (var p = 0; p < points.length; p++)
    {
        ctx.lineTo(points[p][0] + 100, points[p][1] + 100)
    }
    ctx.stroke();
    // draw head
    ctx.fillStyle = "gold";
    ctx.fillRect(headPos[0] * 5 + 100, headPos[1] * 5 + 100, 20, 20);

    // action update
    let act = actions[currentAction];

    determineAction(act);

}, 10);


// actions

function determineAction(action)
{
    if (action["name"] == "move")
    {
        time += (action["s"] / 50) / Math.sqrt((action["x"] - startMovementHeadPos[0])**2 + (action["y"] - startMovementHeadPos[1])**2);
        if (time >= 1.01)
        {
            currentAction += 1;
            startMovementHeadPos = headPos;
            time = 0;
        }
        
        // different actions

        if (action["t"] == "linear")
        {
            move(action["x"], action["y"], action["s"]);
        }
        if (action["t"] == "cubic")
        {
            cubic(action["x"], action["y"], action["ax"], action["bx"], action["ay"], action["by"], action["s"]);
        }

    }
}

function move(x, y, s)
{ 

    headPos = [ lerp(startMovementHeadPos[0], x, time), lerp(startMovementHeadPos[1], y, time) ];
}

function cubic(x, y, p0x, p1x, p0y, p1y, s)
{ 
    let Ax = lerp(startMovementHeadPos[0], p0x, time);
    let Ay = lerp(startMovementHeadPos[1], p0y, time);

    let Bx = lerp(p0x, p1x, time);
    let By = lerp(p0y, p1y, time);

    let Cx = lerp(p1x, x, time);
    let Cy = lerp(p1y, y, time);


    let Dx = Ax+(Bx - Ax)*time; 
    let Dy = Ay+(By - Ay)*time; 

    let Ex = Bx+(Cx - Bx)*time; 
    let Ey = By+(Cy - By)*time; 

    let Px = Dx+(Ex - Dx)*time;
    let Py = Dy+(Ey - Dy)*time;

    console.log(Ax + ' / ' + Bx);
    console.log(Ex);

    headPos = [ Px, Py ];

}

function lerp(p0, p1, t)
{
    return p0+(p1 - p0)*t;
}