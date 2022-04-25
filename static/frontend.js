var btnmoncul = document.getElementById("moncul")

btnmoncul.addEventListener("click", () =>{
    postmooncul()
})

function postmooncul()
{
    var url = "http://localhost:3000/home";
    var params = "lorem=ipsum&name=alpha";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    
    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
    xhr.send(params);
}
