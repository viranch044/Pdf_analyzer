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
  // pdf file error state

  // handle file onChange event

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
        />
      </div>

      {/* View PDF */}
      {canShowJS && (
        <div className="showjs">
          <div id="">{jsData}</div>
        </div>
      )}
      <div className="pdfviewer">
        {canShowPdf && <PdfViewer pdfFile={pdfFile} />}
      </div>
    </div>
  );
}

export default App;
