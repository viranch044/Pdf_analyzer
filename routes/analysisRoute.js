const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const fs = require('fs')



const { spawn } = require("child_process");
var SHA256 = require("crypto-js/sha256")

let existingJsHashes = ["07513a5a6cc2e5ab200ae355c08035617fc745becdac70dcbfe2f8d45d2ba203", "13b5b791b229c0a07d33a211e1a3649fa5dac8208376a0eb6a363220f8fe1a83", "d9ffac1033182ac170638080841f71a547ef63858ccc590140ba664bdc6333d7", "7dedaad152c0d0d2bdb4aed0d9bbdb6be90ac2b984dd58a5f70a56a559609e63",
"af13612cb5877d120187dc8e04231d72e632dc1f84ac0a63c2cd92d7ee559d5c", "f954da4e25d03c022b98e3cbadd0e65fb2d14ba280b0da924ad36f5a681c3e4f", "ecfe4a161a69274ce7e8ffc4d9f0b74fad5ae7d5cc5fe0db84715094b723e2c1",
"34716f6514d1cdd8c3aca04aa2b6ecf167cce35ef30280445055fc037fd1ec6a", "5fcd08c53fb5dac407ca5116c23b12cc3258f04de079592d00f7d2a65a8ef446", "fb1d32e4ed4153845a75a2897e88d482e05248a938e3883835b1c8120b1f3ffb"
]

// 2019 - 1
// 2017 - 1, 2, 3
// 2016 - 1, 2, 3
// 2015 - 1, 2, 3

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
            "actions": null,   -- We have to discard /Name tag from this object. 
            "elements": [],
            "js_vulns": [],
            "triggers": null,
            "urls": null
        },
        Isme se kuch bhi ho

        data.peepdf_analysis.basic.errors -- Isme uper wali ek bhi ho to False return krna h 
    */

router.get("/:file_name", (req, res, next) => {
    fileName = "./uploads/" + req.params.file_name;

    const path_peepdf = path.join(__dirname, "..\\peepdf-master\\peepdf.py");

    const callToolsPromise = () => {
      return new Promise((resolve, reject) => {
        var child = spawn("python", [
          `${path_peepdf}`,
          "-f",
          "-j",
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
          console.log("Rejecting on error while analysis in progress.");
          reject(data);
        });

        child.on("exit", (code, signal) => {
          console.log(
            "The analysis is completed using peepdf tool."
          );
          resolve(resp);
        });
      });
    };

    callToolsPromise()
      .then((response) => {
        const data = JSON.parse(response);

        console.log(data.peepdf_analysis.advanced)
        var sus_element_ = false;
        for (var i = 0; i < data.peepdf_analysis.advanced.length; i++) {
          var suspicious_element_object =
            data.peepdf_analysis.advanced[i].version_info.suspicious_elements;
          if(suspicious_element_object.triggers!=null) delete suspicious_element_object.triggers['/Names'];
          if(suspicious_element_object.triggers != null && Object.keys(suspicious_element_object.triggers).length == 0){
            suspicious_element_object.triggers = null;
          }
          if (
            suspicious_element_object.actions != null ||
            (suspicious_element_object.triggers != null) ||
            suspicious_element_object.urls != null ||
            suspicious_element_object.elements.length > 0 ||
            suspicious_element_object.js_vulns.length > 0
          ) {
            console.log("Line no 227 ")
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

        const path_peepdf = path.join(__dirname, "..\\peepdf-master\\peepdf.py");

        const path_script = path.join(__dirname, "..\\peepdf-master\\xtract.txt");

        const getJavaScript = () => {
          return new Promise((resolve, reject) => {
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
              console.log("Rejecting on error while fetching the JavaScript.");
              reject(data);
            });

            child.on("exit", (code, signal) => {
              console.log(
                "JavaScript is fetched successfully from the uploaded PDF."
              );
              if(resp.length > 4 ){
                resp = resp.slice(0, -4);
              }
              else{
                resp = "";
              }
              resolve(resp);
            });
          });
        };

        getJavaScript()
          .then((response) => {

            var hashed_js_response;
            js_response_text_ += response;

            var hashed_js_response = js_response_text_.replace(/[\r\n]+/gm, "")

            hashed_js_response = hashed_js_response.replace(/\s/g, '');   

            hashed_js_response = SHA256(hashed_js_response).toString();

            console.log(hashed_js_response)

            var existing_js = false;

            for(var index =0; index < existingJsHashes.length; index ++){
              if(existingJsHashes[index] == hashed_js_response) existing_js = true;
            }

            fs.unlink(fileName, (err) => {
              if (err) {
                console.error(err)
                return
              }
            })
            res.send({
              existing_js : existing_js,   // check if the JavaScript is already hashed or not. 
              js_response_text : js_response_text_, // JavaScript present in the PDF
              sus_element : sus_element_,  // true if there are any suspicious elements
              structural_error : structural_error_  // true if there are any structural errors present in the PDF
            }) ;
          })
          .catch((err) => {
            console.log(err);
            return "error";
          });

      })
      .catch((err) => {
        console.log(err);
        res.send("Error occured while analyzing the pdf file");
      });
});

module.exports = router;
