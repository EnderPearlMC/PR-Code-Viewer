/* 

    Code par NATHAN MARCHIORI 

*/

let input = document.querySelector("input");


//le boutton pour choisir le fichier
input.addEventListener("change", () => {
  let files = input.files;
  if (files.length == 0) return;
  const file = files[0];

  if (!file.name.endsWith(".pr")) {
    alert("please use a .pr file");
    return;
  }
  console.log("File chosen");
  let reader = new FileReader();
  reader.onload = (e) => {
    const file = e.target.result;
    // contenue du fichier ligne par ligne en array
    const lines = file.split(/\r\n|\n/);
    setActions(translate(lines));

  };

  reader.onerror = (e) => alert(e.target.error.name);
  reader.readAsText(file);
});

//pour trouver c quelle function + resultat finale

function translate(text) {
    let result = [];
  
    for (let i = 0; i < text.length; i++) {
  
      const element = text[i];
      if (element.startsWith("MOVE")) {
          result.push(moveT(element));
      } else if (element.startsWith("TOOL")) {
          result.push(tool(element))
      }
    }
  
    return result;
}

//pour traduire les function MOVE

function moveT(moveElement) {
  moveElement = moveElement.split(" ");
  let result = {
    name: moveElement[0].toLowerCase(),
    x: roundToOneDecimal(parseFloat(moveElement[1].split(":")[1])),
    y: roundToOneDecimal(parseFloat(moveElement[2].split(":")[1])),
    s: roundToOneDecimal(parseFloat(moveElement[3].split(":")[1])),
    t: moveElement[4].split(":")[1],
  };

  if (result.t == "cubic") {
    result.ax = roundToOneDecimal(parseFloat(moveElement[5].split(":")[1]));
    result.ay = roundToOneDecimal(parseFloat(moveElement[6].split(":")[1]));
    result.bx = roundToOneDecimal(parseFloat(moveElement[7].split(":")[1]));
    result.by = roundToOneDecimal(parseFloat(moveElement[8].split(":")[1]));
  }

  return result;
}

//pour traduire les functions TOOL
function tool(toolElement) {
    toolElement = toolElement.split(" ");
    let result = {
        name: toolElement[0].toLowerCase(),
        t: toolElement[1].split(":")[1].toLowerCase(),
        p: toolElement[2].split(":")[1].toLowerCase(),
    }
    return result
}

function roundToOneDecimal(num)
{
   return Math.round( num * 10 + Number.EPSILON ) / 10;
}