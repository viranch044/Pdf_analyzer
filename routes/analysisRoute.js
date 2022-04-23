const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");

const { spawn } = require("child_process");
const { copyFileSync } = require("fs");
const { time } = require("console");
const { response } = require("express");

var output;

app.use(express.static(path.join(__dirname, "../public")));

const error_check = (error) => {
  return (
    error == "Bad PDF header" ||
    error == "%%EOF not found" ||
    error == "Xref section not found" ||
    error == 'EOF while looking for symbol \\"startxref\\"'
  );
};

const suspiciousElementCheck = (data) => {
  var sus_element_ = false;
  for (var i = 0; i < data.peepdf_analysis.advanced.length; i++) {
    var suspicious_element_object =
      data.peepdf_analysis.advanced[i].version_info.suspicious_elements;

    if (
      suspicious_element_object.actions != null ||
      suspicious_element_object.triggers != null ||
      suspicious_element_object.urls != null ||
      suspicious_element_object.elements.length > 0 ||
      suspicious_element_object.js_vulns.length > 0
    ) {
      sus_element_ = true;
      break;
    }
  }

  var structural_error_ = false;
  var error_objects = data.peepdf_analysis.basic.errors;

  for (var i = 0; i < error_objects.length; i++) {
    if (error_check(error_objects[i])) {
      structural_error_ = true;
      break;
    }
  }

  var js_response_text_ = "";

  fileName = "./uploads/" + "file_1649833089059.pdf";

  const path_peepdf = path.join(__dirname, "..\\peepdf-master\\peepdf.py");

  const path_script = path.join(__dirname, "..\\peepdf-master\\xtract.txt");

  const getJavaScript = () => {
    return new Promise((resolve, reject) => {
      console.log("Heeee");
      var child = spawn("python", [
        `${path_peepdf}`,
        "-f",
        "-l",
        "-s",
        `${path_script}`,
        `${fileName}`,
      ]);
      var resp = "";

      child.stdout.on("data", function (buffer) {
        resp += buffer.toString();
      });

      child.stderr.on("data", (data) => {
        console.error(`stderr: ${data}`);
      });

      child.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
      });

      child.on("error", (error) => {
        console.log("Rejecting on error in UI automation script");
        reject(data);
      });

      child.on("exit", (code, signal) => {
        console.log(
          "The UI automation script is completed and the tests are running on the remote machine"
        );
        resolve(resp);
      });
    });
  };

  getJavaScript()
    .then((response) => {
      // console.log("response = " + response);
      js_response_text_ += response;
      console.log(js_response_text_);
      return {
        js_response_text: js_response_text_,
        sus_element: sus_element_,
        structural_error: structural_error_,
      };
      // const data = JSON.parse(response);
      // if(suspiciousElementCheck(data)){
      //     res.send("false");
      // }
      // else{
      //     res.send("true");
      // }
      // console.log(data.peepdf_analysis.advanced[0]);
    })
    .catch((err) => {
      return "error";
      console.log(err);
    });

  // if(response_text != "") return response_text;  // return the JavaScript text present in the Pdf file

  /*
        "Bad PDF header",
        "%%EOF not found",
        "Xref section not found",
        "EOF while looking for symbol \"startxref\""


        data.peepdf_analysis.advanced[0].version_info.js_objects ki Size 1 se jyda ho to 

        "js_objects": [],
        "objects": [],
        "streams": [],
        "suspicious_elements": {
            "actions": null,
            "elements": [],
            "js_vulns": [],
            "triggers": null,
            "urls": null
        },
        Isme se kuch bhi ho

        data.peepdf_analysis.basic.errors -- Isme uper wali ek bhi ho to False return krna h 
    */
};

router.get("/:file_name", (req, res, next) => {
  // var fileName = req.body.fileName;

  res.send({
    js_response_text: "fefeiji",
    sus_element: false,
    structural_error: true,
  });

  //   console.log(req.params.file_name);

  //   fileName = "./uploads/" + req.params.file_name;

  //   const path_peepdf = path.join(__dirname, "..\\peepdf-master\\peepdf.py");

  //   // run_cmd("python", [`${path_peepdf}`, '-f', '-j', `${fileName}`], function(text) { console.log (text) ; output = text; console.log(output);})

  //   const callToolsPromise = () => {
  //     return new Promise((resolve, reject) => {
  //       // console.log(req)
  //       var child = spawn("python", [
  //         `${path_peepdf}`,
  //         "-f",
  //         "-j",
  //         `${fileName}`,
  //       ]);
  //       var resp = "";

  //       child.stdout.on("data", function (buffer) {
  //         resp += buffer.toString();
  //       });

  //       child.stderr.on("data", (data) => {
  //         console.error(`stderr: ${data}`);
  //       });

  //       child.on("close", (code) => {
  //         console.log(`child process exited with code ${code}`);
  //       });

  //       child.on("error", (error) => {
  //         console.log("Rejecting on error in UI automation script");
  //         reject(data);
  //       });

  //       child.on("exit", (code, signal) => {
  //         console.log(
  //           "The UI automation script is completed and the tests are running on the remote machine"
  //         );
  //         resolve(resp);
  //       });
  //     });
  //   };

  //   callToolsPromise()
  //     .then((response) => {
  //       const data = JSON.parse(response);

  //       // var sus_element_check_response = suspiciousElementCheck(data);

  //       ///////////////*********

  //       var sus_element_ = false;
  //       for (var i = 0; i < data.peepdf_analysis.advanced.length; i++) {
  //         var suspicious_element_object =
  //           data.peepdf_analysis.advanced[i].version_info.suspicious_elements;

  //         if (
  //           suspicious_element_object.actions != null ||
  //           suspicious_element_object.triggers != null ||
  //           suspicious_element_object.urls != null ||
  //           suspicious_element_object.elements.length > 0 ||
  //           suspicious_element_object.js_vulns.length > 0
  //         ) {
  //           sus_element_ = true;
  //           break;
  //         }
  //       }

  //       var structural_error_ = false;
  //       var error_objects = data.peepdf_analysis.basic.errors;

  //       for (var i = 0; i < error_objects.length; i++) {
  //         if (error_check(error_objects[i])) {
  //           structural_error_ = true;
  //           break;
  //         }
  //       }

  //       var js_response_text_ = "";

  //       fileName = "./uploads/" + "file_1649833089059.pdf";

  //       const path_peepdf = path.join(__dirname, "..\\peepdf-master\\peepdf.py");

  //       const path_script = path.join(__dirname, "..\\peepdf-master\\xtract.txt");

  //       const getJavaScript = () => {
  //         return new Promise((resolve, reject) => {
  //           console.log("Heeee");
  //           var child = spawn("python", [
  //             `${path_peepdf}`,
  //             "-f",
  //             "-l",
  //             "-s",
  //             `${path_script}`,
  //             `${fileName}`,
  //           ]);
  //           var resp = "";

  //           child.stdout.on("data", function (buffer) {
  //             resp += buffer.toString();
  //           });

  //           child.stderr.on("data", (data) => {
  //             console.error(`stderr: ${data}`);
  //           });

  //           child.on("close", (code) => {
  //             console.log(`child process exited with code ${code}`);
  //           });

  //           child.on("error", (error) => {
  //             console.log("Rejecting on error in UI automation script");
  //             reject(data);
  //           });

  //           child.on("exit", (code, signal) => {
  //             console.log(
  //               "The UI automation script is completed and the tests are running on the remote machine"
  //             );
  //             resolve(resp);
  //           });
  //         });
  //       };

  //       getJavaScript()
  //         .then((response) => {
  //           // console.log("response = " + response);
  //           js_response_text_ += response;
  //           console.log(js_response_text_);

  //           res.send({
  //             js_response_text: "huhu",
  //             sus_element: true,
  //             structural_error: false,
  //           });
  //         })
  //         .catch((err) => {
  //           return "error";
  //           console.log(err);
  //         });

  //       ///////////////**********

  //       // res.send(sus_element_check_response);
  //       // if(suspiciousElementCheck(data)){
  //       //     res.send("false");
  //       // }
  //       // else{
  //       //     res.send("true");
  //       // }
  //       // console.log(data.peepdf_analysis.advanced[0]);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       res.send("Error occured while analyzing the pdf file");
  //     });
});

module.exports = router;
