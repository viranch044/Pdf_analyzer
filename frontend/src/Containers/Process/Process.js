import React, { useState } from "react";
import "./Process.css";
// import PdfViewer from "./PdfViewer/PdfViewer";
import axios from "axios";
import Modal from "../Modal/Modal";
import loader from './loader.svg'

function Process({
  susElementPresent,
  setSusElementPresent,
  jsPresent,
  setJsPresent,
  structuralError,
  setStructuralErrorPresent,
  setPdfFile,
  canShowPdf,
  setCanShowPdf,
  jsData,
  setJSData,
  canShowJS,
  setShowJS,
  setShowProcess,
  showProcess,
  harmfulJSPresent,
  setHarmfulJSPresent
}) {
  const [canAnalyse, setCanAnalyse] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [fileName, setFileName] = useState("");
  const [analyzeLoader, setAnalyzeLoader] = useState(false);
  const [modal, setModal] = useState(false);

  const [checks, setShowChecks] = useState(false);

  const allowedFiles = ["application/pdf"];
  const changeHandler = (event) => {
    setCanShowPdf(false);
    let selectedFile = event.target.files[0];
    console.log(selectedFile);
    setSelectedFileName(selectedFile.name);
    let reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = (e) => {
      setPdfFile(e.target.result);
    };
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(selectedFile);
    if (selectedFile) {
      if (selectedFile && allowedFiles.includes(selectedFile.type)) {
        axios.post("http://localhost:5000/upload", formData).then((res) => {
          console.log(res.data.filename);

          setFileName(res.data.filename);
          setCanAnalyse(true);
        });
      }
    }
  };

  const uploadFile = () => {
    document.getElementById("upload_pdf_btn").click();
  };

  const handleAnalyse = () => {
    setAnalyzeLoader(true);
    setCanShowPdf(false);

    axios.get(`http://localhost:5000/analyze/${fileName}`).then((res) => {
      console.log(res);
      if (res.data) {
        if (res.data.js_response_text.length > 0) {
          setJsPresent(true);
          if(res.data.existing_js){
            setHarmfulJSPresent(true)
          } 
          setJSData(res.data.js_response_text);
        }
        if (res.data.sus_element === true) {
          setSusElementPresent(true);
          setModal(true);
        } else {
          // setCanShowPdf(true);
          setModal(true);
        }
        if (res.data.structural_error === true) {
          setStructuralErrorPresent(true);
        }
      }

      setAnalyzeLoader(false);
      setShowChecks(true);
    });
  };
  return (
    <div className="process_div">
      <p className="upload_line">Upload a PDF file to analyse</p>

      <div className="upload_btn_div">
        <button className="btn_custom" onClick={uploadFile.bind(this)}>
          <p>Upload PDF</p>
        </button>
        <p className="selectedFileName">{selectedFileName}</p>
        <input
          type="file"
          name="file"
          id="upload_pdf_btn"
          onChange={changeHandler}
          className="input_btn_file"
          style={{ display: "none" }}
          accept=".pdf"
        />
      </div>
      {canAnalyse && (
        <div className="analyse_btn_div">
          <button className="btn_custom analyse_btn" onClick={handleAnalyse}>
            <p>Analyze</p>
          </button>
        </div>
      )}
      {analyzeLoader && <img src={loader} className=""/> }
      <Modal
        checks={checks}
        jsPresent={jsPresent}
        susElementPresent={susElementPresent}
        structuralError={structuralError}
        modal={modal}
        setModal={setModal}
        canShowPdf={canShowPdf}
        setCanShowPdf={setCanShowPdf}
        canShowJS={canShowJS}
        setShowJS={setShowJS}
        setShowProcess={setShowProcess}
        showProcess={showProcess}
        harmfulJSPresent={harmfulJSPresent}
        setHarmfulJSPresent={setHarmfulJSPresent}
      />

      {/* <PdfViewer /> */}
    </div>
  );
}

export default Process;
