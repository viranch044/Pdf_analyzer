import React from "react";
import "./Modal.css";

export default function Modal({
  modal,
  setModal,
  checks,
  jsPresent,
  susElementPresent,
  structuralError,
  canShowPdf,
  setCanShowPdf,
  canShowJS,
  setShowJS,
}) {
  const toggleModal = () => {
    setModal(!modal);
  };
  const showPDF = () => {
    setModal(!modal);
    setCanShowPdf(true);
  };
  const showJS = () => {
    setModal(!modal);
    setShowJS(true);
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <>
      {/* <button onClick={toggleModal} className="btn-modal">
        Open
      </button> */}
      {modal && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>Hello Modal</h2>
            {checks && (
              <div className="checks">
                {jsPresent && <div className="">Js element Present</div>}
                <span>
                  JS Present{" "}
                  {jsPresent ? (
                    <i className="green_check fa-solid fa-circle-check"></i>
                  ) : (
                    <i class="red_cross fa-solid fa-circle-xmark"></i>
                  )}
                </span>
                <span>
                  {" "}
                  Sus element Present{" "}
                  {susElementPresent ? (
                    <i className="green_check fa-solid fa-circle-check"></i>
                  ) : (
                    <i class="red_cross fa-solid fa-circle-xmark"></i>
                  )}
                </span>
                <span>
                  {" "}
                  Structural error Present{" "}
                  {structuralError ? (
                    <i className="green_check fa-solid fa-circle-check"></i>
                  ) : (
                    <i class="red_cross fa-solid fa-circle-xmark"></i>
                  )}
                </span>
              </div>
            )}
            <button className="close-modal btn_custom" onClick={toggleModal}>
              <p>Close</p>
            </button>
            <div className="modal-below-btns">
              {jsPresent && (
                <button className="btn_custom" onClick={showJS}>
                  <p> Show JS</p>
                </button>
              )}
              {!susElementPresent && (
                <button className="btn_custom" onClick={showPDF}>
                  <p> Show PDF</p>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
