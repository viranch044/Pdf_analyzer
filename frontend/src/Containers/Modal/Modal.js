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
  setShowProcess,
  showProcess,
}) {
  const toggleModal = () => {
    setModal(!modal);
  };
  const showPDF = () => {
    setModal(!modal);
    setCanShowPdf(true);
    setShowProcess(false);
  };
  const showJS = () => {
    setModal(!modal);
    setShowJS(true);
    setShowProcess(false);
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
            <h2>
              Analysis results obtained using{" "}
              <a href="https://github.com/jesparza/peepdf">peepdf</a>{" "}
            </h2>
            {susElementPresent && (
              <div className="modal_statement">
                There are suspicious elements present in the pdf. They can be
                very harmful for your machine if you open the pdf in the pdf
                viewer.
              </div>
            )}

            {!susElementPresent && jsPresent && (
              <div className="modal_statement">
                There is JavaScript present in the document. You can look at it
                and analyze it on your own. It's advised that you do not open
                the pdf as the javascript might be harmful for your machine.
              </div>
            )}
            {checks && (
              <div className="table_checks">
                <table rules="all" className="check_table">
                  <thead>
                    <tr>
                      <th>Properties to Check</th>
                      <th>Present</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th className="table_left_text">Javascript</th>
                      <th>
                        {jsPresent ? (
                          <i className="green_check fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="red_cross fa-solid fa-circle-xmark"></i>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th className="table_left_text">Sus element</th>
                      <th>
                        {susElementPresent ? (
                          <i className="green_check fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="red_cross fa-solid fa-circle-xmark"></i>
                        )}
                      </th>
                    </tr>
                    <tr>
                      <th className="table_left_text">Structural error</th>
                      <th>
                        {structuralError ? (
                          <i className="green_check fa-solid fa-circle-check"></i>
                        ) : (
                          <i className="red_cross fa-solid fa-circle-xmark"></i>
                        )}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <button
              className="close-modal btn_custom modal_btn"
              onClick={toggleModal}
            >
              <p>Close</p>
            </button>
            <div className="modal-below-btns">
              {jsPresent && (
                <button className="btn_custom modal_btn" onClick={showJS}>
                  <p> Show JS</p>
                </button>
              )}
              {!susElementPresent && (
                <button className="btn_custom modal_btn" onClick={showPDF}>
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
