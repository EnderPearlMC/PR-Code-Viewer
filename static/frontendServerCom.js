var home = document.getElementById("home_btn")
var xl = document.getElementById("xl_btn")
var xp = document.getElementById("xp_btn")
var yl = document.getElementById("yl_btn")
var yp = document.getElementById("yp_btn")
var sp = document.getElementById("sp_btn")

var pos = [0, 0];

home.addEventListener("click", () =>{
    sendCommand("home", "");
    pos = [0, 0];
})

xl.addEventListener("click", () =>{
    pos[0] -= 10;
    sendCommand("move", `x=${pos[0]}&y=${pos[1]}&s=3000&a=10000`);
})

xp.addEventListener("click", () =>{
    pos[0] += 10;
    sendCommand("move", `x=${pos[0]}&y=${pos[1]}&s=3000&a=10000`);
})

yl.addEventListener("click", () =>{
    pos[1] -= 10;
    sendCommand("move", `x=${pos[0]}&y=${pos[1]}&s=3000&a=10000`);
})

yp.addEventListener("click", () =>{
    pos[1] += 10;
    sendCommand("move", `x=${pos[0]}&y=${pos[1]}&s=3000&a=10000`);
})

sp.addEventListener("click", () =>{
    var url = "http://localhost:3000/" + "start";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.send("c=" + JSON.stringify(resultTraductSvg));
})

function sendCommand(cmd, params)
{
    var url = "http://localhost:3000/" + cmd;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.send(params);
}
