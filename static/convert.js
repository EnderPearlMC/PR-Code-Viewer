
let inputS = document.getElementById("svg_file_input");
let outputPrCode = [];
let pen = "up";
var resultTraductSvg = [];

// remember start pos to allow Z command
let pathStartPos = null;

// conversion settings
let SPEED = 1200;
let RESIZE = 1;

//le boutton pour choisir le fichier
inputS.addEventListener("change", () => {
  let files = inputS.files;
  if (files.length == 0) return;
  const file = files[0];

  if (!file.name.endsWith(".svg")) {
    alert("please use a .svg file");
    return;
  }
  console.log("svg chosen");
  let reader = new FileReader();
  reader.onload = (e) => {
    const file = e.target.result;
    // contenue du fichier ligne par ligne en array
    convert(file);

  };

  reader.onerror = (e) => alert(e.target.error.name);
  reader.readAsText(file);
});

function convert(svgText)
{
  var parser = new DOMParser();
  var svg = parser.parseFromString(svgText, "image/svg+xml");
  firstParse(svg.getElementById("layer1"));
  
  // start preview
  setActions(outputPrCode);
  tranductInvers()
  restart();
  STATE = "preview";
}

function firstParse(elements)
{
  let children = elements.childNodes;

  children.forEach(c => {
    
    if (c.nodeName == "path")
    {
      parsePath(c);
    }
    else if (c.nodeName == "g")
    {
      firstParse(c);
    }
  });

}

function parsePath(element)
{

  try
  {
    pathStartPos = [outputPrCode[outputPrCode.length - 1].x, outputPrCode[outputPrCode.length - 1].y];
  }
  catch
  {
    pathStartPos = [0, 0];
  }

  let splited = element.getAttribute("d").split(" ");

  let svgActions = [];

  // Parsing
  let startedAction = "";
  for (let i = 0; i < splited.length + 1; i++)
  {
    if (!isNaN(parseInt(splited[i])))
    {
      startedAction += " " + splited[i];
    }
    else
    {
      if (startedAction != "")
      {
        svgActions.push(startedAction);
        startedAction = "";
      }
      startedAction += splited[i];
    }
  }
  // end of parsing
  // console.log(svgActions)

  // translating
  svgActions.forEach(a => {
    if (a.startsWith("M"))
    {
      parseMove(a);
    }
    else if (a.startsWith("L"))
    {
      parseLinear(a);
    }
    else if (a.startsWith("C"))
    {
      parseCubic(a);
    }
    else if (a.startsWith("Z"))
    {
      parseLinear(["Z", pathStartPos[0].toString(), pathStartPos[1].toString()]);
    }
  });
  // end translating

  // PEN UP
  outputPrCode.push({
    "name": "tool",
    "t": "felt",
    "p": "up"
  });

}

function parseMove(element)
{
  if (pen == "down")
  {
    outputPrCode.push({
      "name": "tool",
      "t": "felt",
      "p": "up"
    });
    pen = "up";
  }
  let finalCommand = {
    "name": "move",
    "x": "0",
    "y": "0",
    "s": SPEED,
    "t": "linear"
  }
  let x = element.split(" ")[1];
  let y = element.split(" ")[2];
  finalCommand["x"] = Math.round(parseFloat(x) * 100) / 100;
  finalCommand["y"] = Math.round(parseFloat(y) * 100) / 100;
  outputPrCode.push(finalCommand);
}

function parseLinear(element)
{
  if (pen == "up")
  {
    outputPrCode.push({
      "name": "tool",
      "t": "felt",
      "p": "down"
    });
    pen = "down";
  }
  let finalCommand = {
    "name": "move",
    "x": "0",
    "y": "0",
    "s": SPEED,
    "t": "linear"
  }
  let x = element.split(" ")[1];
  let y = element.split(" ")[2];
  finalCommand["x"] = Math.round(parseFloat(x) * 100) / 100;
  finalCommand["y"] = Math.round(parseFloat(y) * 100) / 100;
  outputPrCode.push(finalCommand);
}

function parseCubic(element)
{
  if (pen == "up")
  {
    outputPrCode.push({
      "name": "tool",
      "t": "felt",
      "p": "down"
    });
    pen = "down";
  }
  let finalCommand = {
    "name": "move",
    "x": "0",
    "y": "0",
    "s": 0,
    "t": "cubic",
    "ax": "0",
    "ay": "0",
    "bx": "0",
    "by": "0",
  }
  let x = element.split(",")[2].split(" ")[0];
  let y = element.split(",")[2].split(" ")[1];
  let ax = element.split(",")[0].substring(2).split(" ")[0];
  let ay = element.split(",")[0].substring(2).split(" ")[1];
  let bx = element.split(",")[1].split(" ")[0];
  let by = element.split(",")[1].split(" ")[1];
  finalCommand["x"] = Math.round(parseFloat(x) * 100) / 100 / RESIZE / zoom;
  finalCommand["y"] = Math.round(parseFloat(y) * 100) / 100 / RESIZE / zoom;
  finalCommand["ax"] = Math.round(parseFloat(ax) * 100) / 100 / RESIZE / zoom;
  finalCommand["ay"] = Math.round(parseFloat(ay) * 100) / 100 / RESIZE / zoom;
  finalCommand["bx"] = Math.round(parseFloat(bx) * 100) / 100 / RESIZE / zoom;
  finalCommand["by"] = Math.round(parseFloat(by) * 100) / 100 / RESIZE / zoom;

  if (outputPrCode.includes(finalCommand))
  {
    outputPrCode.push(finalCommand);
  }
}


// traduit svg vers tableau que le server peut lire
function tranductInvers() {
  
  actions.forEach(e => {

    if (e.name == 'move')
    {
      if (e.x)
      {
        test1 = e.name.toUpperCase() + ' X:' + e.x + ' Y:' + e.y + ' S:' + e.s + "\n"
        resultTraductSvg.push(test1)
      }
      // if (e.p)
      // {
      //   test1 = e.name.toUpperCase() + ' T:' + e.t + ' P:' + e.p
      //   resultTraductSvg.push(test1)
      // }
    }
  });
}
