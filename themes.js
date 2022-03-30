var btn = document.getElementById('dark_theme_btn');
var canvas = document.querySelector('canvas');
var html = document.querySelector('html')
var resetBtn = document.getElementById("restart")
var inputBtn = document.querySelector('input[type=file]');
var img = document.getElementById("img-in-btn-for-dark-theme")
let isBlack = false;


btn.addEventListener("click", () =>{
    canvas.style.removeProperty("background-color");
    html.style.removeProperty("background-color");
    resetBtn.style.removeProperty("color");
    inputBtn.style.removeProperty('color');
    if(isBlack)
    {
        canvas.style.backgroundColor = "##e0e0e0";
        html.style.backgroundColor = "##e0e0e0";
        resetBtn.style.color = "#1c1b22";
        inputBtn.style.color = "#1c1b22";
        img.src = "./img/moon.png"
        isBlack = false;
    } else if(!isBlack)
    {
    canvas.style.backgroundColor = "#424141";
    html.style.backgroundColor = "#424141";
    resetBtn.style.color = "#e0e0e0";
    inputBtn.style.color = "#e0e0e0";   
    img.src = "./img/sun.png"
    isBlack = true;
    }
})