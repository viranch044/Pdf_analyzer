const form = document.querySelector("form"),
fileInput = document.querySelector(".file-input"),
uploadedArea = document.querySelector(".uploaded-area");
analyze_button = document.getElementById("analyze_button");



form.addEventListener("click", () =>{
  fileInput.click();
});

fileInput.onchange = ({target})=>{
  
  let file = target.files[0];
  console.log(file)
  if(file){
    let fileName = file.name;

    const reader = new FileReader();
		reader.readAsDataURL(file);

    reader.onload = () => {
      console.log(reader.result)
    }
		
    if(fileName.length >= 20){
      fileName = fileName.substring(0, fileName.length - 4);

      console.log(fileName)
      fileName = fileName.substring(0, 21) + "... ." + "pdf";
    }
    console.log("Here")
    document.getElementById('spin_icon').style.display = "flex"
    
    

    setTimeout(() => {  uploadFile(fileName); }, 100);
  }
}

function uploadFile(name){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "upload", false);

  let data = new FormData(form);
  console.log(data)
  xhr.send(data);

  if(xhr.status == 200){

    // response_text = json.str

    console.log(typeof(xhr.response))
    console.log(typeof(xhr.responseText))

    response_text_obj = JSON.parse(xhr.responseText);
    file_name = response_text_obj.filename
    document.getElementById('spin_icon').style.display = "none"
  
    let uploadedHTML = `<li class="row">
                          <div class="content upload">
                            <i class="fas fa-file-alt"></i>
                            <div class="details">
                              
                              <span class="name">${name}  • Uploaded </span>
                            </div>
                          </div>
                        </li>`;
    uploadedArea.innerHTML = uploadedHTML;

    document.getElementById("analyze_button").style.display = "flex";
  }
  
}

analyze_button.addEventListener("click", () => {

  
  // let xhr = new XMLHttpRequest();
  // xhr.open("GET", "analyze");

  // // let data = new FormData(form);
  // // console.log(data)
  // xhr.send(null);
  location.href = "http://localhost:5000/pdf.html"
})