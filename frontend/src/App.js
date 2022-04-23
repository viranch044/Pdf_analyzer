import { useState } from "react";
import PdfViewer from "./Containers/PdfViewer/PdfViewer";
import "./App.css";

import Process from "./Containers/Process/Process";

function App() {
  // creating new plugin instance

  // pdf file onChange state
  const [susElementPresent, setSusElementPresent] = useState(false);
  const [jsPresent, setJsPresent] = useState(false);

  const [structuralError, setStructuralErrorPresent] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [canShowPdf, setCanShowPdf] = useState(false);
  const [canShowJS, setShowJS] = useState(false);
  const [jsData, setJSData] = useState("");
  const [showProcess, setShowProcess] = useState(true);
  // pdf file error state

  // handle file onChange event
  const showProcessFunc = () => {
    setShowProcess(true);
    setCanShowPdf(false);
    setShowJS(false);
  };

  const showJsFunc = () => {
    setShowJS(!canShowJS);
  };
  const showPdfFunc = () => {
    setCanShowPdf(!canShowPdf);
  };
  // const handleFile = (e) => {
  //   let selectedFile = e.target.files[0];
  //   // console.log(selectedFile.type);
  //   if (selectedFile) {
  //     if (selectedFile && allowedFiles.includes(selectedFile.type)) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(selectedFile);
  //       reader.onloadend = (e) => {
  //         setPdfError("");
  //         setPdfFile(e.target.result);
  //       };
  //     } else {
  //       setPdfError("Not a valid pdf: Please select only PDF");
  //       setPdfFile("");
  //     }
  //   } else {
  //     console.log("please select a PDF");
  //   }
  // };

  return (
    <div className="container">
      <div className="">
        {!showProcess && (
          <div className="">
            <button className="btn_custom" onClick={showProcessFunc}>
              <p>Upload PDF file</p>
            </button>
            {jsData && (
              <button className="btn_custom" onClick={showJsFunc}>
                {!canShowJS ? <p> Show JS</p> : <p>Hide JS</p>}
              </button>
            )}
            {!susElementPresent && (
              <button className="btn_custom" onClick={showPdfFunc}>
                {!canShowPdf ? <p>Show PDF</p> : <p>Hide PDF</p>}
              </button>
            )}
          </div>
        )}
        {showProcess && (
          <Process
            susElementPresent={susElementPresent}
            setSusElementPresent={setSusElementPresent}
            jsPresent={jsPresent}
            setJsPresent={setJsPresent}
            structuralError={structuralError}
            setStructuralErrorPresent={setStructuralErrorPresent}
            setPdfFile={setPdfFile}
            canShowPdf={canShowPdf}
            setCanShowPdf={setCanShowPdf}
            canShowJS={canShowJS}
            setShowJS={setShowJS}
            jsData={jsData}
            setJSData={setJSData}
            setShowProcess={setShowProcess}
            showProcess={showProcess}
          />
        )}
      </div>

      {/* View PDF */}
      {canShowJS && (
        <div className="showjs">
          <div id="">{jsData}</div>
        </div>
      )}
      <div className="pdfviewer">
        {canShowPdf && <PdfViewer pdfFile={pdfFile}  />}
      </div>
    </div>
  );
}

export default App;
