/* 

    Code par AUGUSTIN BOUYER

*/

/**let inputS = document.getElementById("svg_file_input");


//le boutton pour choisir le fichier
inputS.addEventListener("change", () => {
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
});**/