import React from "react";
// Import Worker
import { Worker } from "@react-pdf-viewer/core";
// Import the main Viewer component
import { Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// default layout plugin
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import styles of default layout plugin
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {zoomPlugin} from '@react-pdf-viewer/zoom'


function PdfViewer({ pdfFile }) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin()
  const {Zoom} = zoomPluginInstance;
  <Zoom></Zoom>

  return (
    <div className="">
      {pdfFile && (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfFile}
            plugins={[defaultLayoutPluginInstance]}
          ></Viewer>
        </Worker>
      )}
    </div>
  );
}

export default PdfViewer;
