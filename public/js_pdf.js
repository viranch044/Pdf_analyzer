const zoomButton = document.getElementById('zoom');
const input = document.getElementById('inputFile');
const openFile = document.getElementById('openPDF');
const currentPage = document.getElementById('current_page');
const viewer = document.querySelector('.pdf-viewer');
const js_viewer = document.querySelector('.js-viewer')
let currentPDF = {}
let currentFileName = "";
var currentFileData = "";
var js_data = ""
const form = document.querySelector("form")
fileInput = document.querySelector(".file-input")
uploadedArea = document.querySelector(".uploaded-area");
analyze_button = document.getElementById("analyze_button");
non_malicious_button = document.getElementById("non_malicious_button")
malicious_button = document.getElementById("malicious_button")
open_analyzed_pdf1 = document.getElementById("open_analyzed_pdf1")
open_analyzed_pdf2 = document.getElementById("open_analyzed_pdf2")
go_to_homepage1 = document.getElementById("go_to_homepage1")
go_to_homepage2 = document.getElementById("go_to_homepage2")
open_new_PDF = document.getElementById("open_new_PDF")
show_javaScript = document.getElementById("show_javaScript");



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
		// now call the upload file function
		currentFileData = reader.result;
		
	}
	if(fileName.length >= 20){
		fileName = fileName.substring(0, fileName.length - 4);
  
		console.log(fileName)
		fileName = fileName.substring(0, 21) + "... ." + "pdf";
	  }
	  
	  document.getElementById('spin_icon').style.display = "flex"
	setTimeout(() => {  uploadFile(fileName); }, 100);
  }
}

// ababababababababab                                                            

function uploadFile(name, file_data){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "upload", false);

  let data = new FormData(form);
  xhr.send(data);

  if(xhr.status == 200){


    console.log(typeof(xhr.response))
    console.log(typeof(xhr.responseText))

    response_text_obj = JSON.parse(xhr.responseText);
    currentFileName = response_text_obj.filename
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

open_analyzed_pdf1.addEventListener("click", () => {
	pdfViewStart(currentFileData);
})

open_analyzed_pdf2.addEventListener("click", () => {
	pdfViewStart(currentFileData);
})

show_javaScript.addEventListener("click", () => {
	view_js();
})

function view_js(){
	zoomButton.disabled = false;
	document.querySelector('.wrapper').classList.add("hidden");
	console.log(js_data)
	js_viewer.innerHTML = `${js_data}`
	js_viewer.classList.remove('hidden');
	document.getElementById('open_new_PDF').classList.remove('hidden');
	zoomButton.disabled = true;
	currentPage.innerHTML = '0 of 0';

}

go_to_homepage1.addEventListener("click", () => {
	uploadedArea.innerHTML = "";
	currentPage.innerHTML = '0 of 0';
	// resetCurrentPDF();

})

go_to_homepage2.addEventListener("click", () => {
	uploadedArea.innerHTML = "";
	currentPage.innerHTML = '0 of 0';

	// resetCurrentPDF();

})

open_new_PDF.addEventListener("click", () => {
	uploadedArea.innerHTML = "";
	document.querySelector('.wrapper').classList.remove("hidden");
	document.getElementById('open_new_PDF').classList.add('hidden');
	js_viewer.classList.add('hidden');
	viewer.classList.add('hidden');
	zoomButton.disabled = true;
	currentPage.innerHTML = '0 of 0';

	// resetCurrentPDF();
})

function xmlGETRequest(){
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "analyze/"+currentFileName, false);
	xhr.send(null);

	if(xhr.status == 200){
		document.getElementById('spin_icon_analysis').style.display = "none";

		// console.log(xhr.responseText);
		var jsonResponse = JSON.parse(xhr.responseText);

		var malicious_body_data = document.getElementById("malicious_body_data");
		var html_to_insert;
		if(jsonResponse.js_response_text != "") {
			html_to_insert = `<div> Embedded JavaScript present in the PDF. <span id="tick">&#9989;</span> </div>`;
			malicious_body_data.insertAdjacentHTML('beforeend', html_to_insert);
			js_data = jsonResponse.js_response_text;
			// non_malicious_button.click();
			// pdfViewStart(currentFileData);
		}
		else{
			html_to_insert = `<div> Embedded JavaScript present in the PDF. <span id="cross">&#10060;</span> </div>`;
			malicious_body_data.insertAdjacentHTML('beforeend', html_to_insert)
		}

		if(jsonResponse.sus_element == true ){
			html_to_insert = `<div> Suspicious elements such as (URI, Popups) present. <span id="tick">&#9989;</span> </div>`;
			malicious_body_data.insertAdjacentHTML('beforeend', html_to_insert)
		}
		else{
			html_to_insert = `<div> Suspicious elements such as (URI, Popups) present. <span id="cross">&#10060;</span> </div>`;
			malicious_body_data.insertAdjacentHTML('beforeend', html_to_insert)
		}

		if(jsonResponse.structural_error == true){
			html_to_insert = `<div> Any structural errors present in the PDF. <span id="tick">&#9989;</span> </div>`;
			malicious_body_data.insertAdjacentHTML('beforeend', html_to_insert)
		}
		else{
			html_to_insert = `<div> Any structural errors present in the PDF. <span id="cross">&#10060;</span> </div>`;
			malicious_body_data.insertAdjacentHTML('beforeend', html_to_insert)
		}
		// else if(xhr.responseText == "false"){
		// 	console.log("There are suspicious elements in the pdf")
		// 	malicious_button.click();
		// }

		if(jsonResponse.js_response_text=="" && jsonResponse.structural_error==false && jsonResponse.sus_element==false){
			non_malicious_button.click();
		}
		else{
			malicious_button.click();
		}
		// else{
		// 	console.log("Error occured while analyzing the pdf file")
		// }
	}
}

analyze_button.addEventListener("click", () => {

    document.getElementById("analyze_button").style.display = "none";
	document.getElementById('spin_icon_analysis').style.display = "flex"

	setTimeout(() => {  xmlGETRequest(); }, 100);

	// pdfViewStart(currentFileData);
	
})


function resetCurrentPDF() {
	currentPDF = {
		file: null,
		countOfPages: 0,
		currentPage: 1,
		zoom: 1.5
	}
}

function pdfViewStart(currentFileData){
	loadPDF(currentFileData);
	zoomButton.disabled = false;
}

zoomButton.addEventListener('input', () => {
	if (currentPDF.file) {
		document.getElementById('zoomValue').innerHTML = zoomButton.value + "%";
		currentPDF.zoom = parseInt(zoomButton.value) / 100;
		renderCurrentPage();
	}
});

document.getElementById('next').addEventListener('click', () => {
	const isValidPage = currentPDF.currentPage < currentPDF.countOfPages;
	if (isValidPage) {
		currentPDF.currentPage += 1;
		renderCurrentPage();
	}
});

document.getElementById('previous').addEventListener('click', () => {
	const isValidPage = currentPDF.currentPage - 1 > 0;
	if (isValidPage) {
		currentPDF.currentPage -= 1;
		renderCurrentPage();
	}
});

function loadPDF(data) {
	const pdfFile = pdfjsLib.getDocument(data);
	resetCurrentPDF();
	pdfFile.promise.then((doc) => {
		currentPDF.file = doc;
		currentPDF.countOfPages = doc.numPages;
		document.querySelector('.wrapper').classList.add("hidden");
		document.getElementById('open_new_PDF').classList.remove('hidden');
		viewer.classList.remove('hidden');
		renderCurrentPage();
	});

}

function renderCurrentPage() {
	currentPDF.file.getPage(currentPDF.currentPage).then((page) => {
		var context = viewer.getContext('2d');
		var viewport = page.getViewport({ scale: currentPDF.zoom, });
		viewer.height = viewport.height;
		viewer.width = viewport.width;

		var renderContext = {
			canvasContext: context,
			viewport: viewport
		};
		page.render(renderContext);
	});
	currentPage.innerHTML = currentPDF.currentPage + ' of ' + currentPDF.countOfPages;
}