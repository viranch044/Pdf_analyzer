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
    js_response_text:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut dolor pariatur quam minus, at reprehenderit eveniet odit itaque ipsa iure quas, omnis harum nostrum distinctio aspernatur necessitatibus asperiores tenetur, corrupti magnam quia iusto. Numquam, illo at expedita quod, tempore perferendis saepe veritatis molestias quas adipisci distinctio? Excepturi eius vitae quaerat reiciendis cum, debitis quod aspernatur ab? Expedita, odit at sint iusto rem nisi nihil quo sapiente dolor fugit. Sit quasi dignissimos repellat laboriosam blanditiis eos iusto sequi aspernatur praesentium dolorem omnis esse laborum velit consequatur accusamus, eveniet sunt maxime tempora corporis! Quasi repudiandae ut quaerat blanditiis. Sequi veniam enim voluptas repellat et sapiente, ipsam placeat dolor optio maiores magnam qui quod illo quas ducimus reiciendis excepturi accusantium soluta. Expedita alias voluptas consequuntur unde facilis tempora illo aut necessitatibus fugiat, accusantium quia velit rerum tempore quasi delectus minus eveniet. Deserunt quo praesentium nemo maxime iure incidunt minus eius aliquid fugiat provident eum ratione illum, nobis veniam atque quam voluptate temporibus placeat. Minus et blanditiis quae maiores consequuntur pariatur beatae eius nobis iure distinctio sapiente temporibus natus sint, tempora omnis magni sequi inventore! Quaerat, quasi ducimus laborum quos enim explicabo in illo, obcaecati molestias sapiente fuga deleniti asperiores consectetur expedita mollitia sit aperiam aliquid quod provident at corrupti dolorem vero ad ipsam? Corrupti doloribus vero officia distinctio, ab ullam maiores sed unde delectus, quae ipsam iusto quidem sint, quos consectetur nisi. Esse dolorem nesciunt accusamus dolore voluptate, fugit quia eos odit vel? Minus, ut obcaecati. Suscipit dolorum pariatur ab hic similique ex velit quia, blanditiis libero delectus quibusdam incidunt commodi tenetur provident at mollitia, ipsum repudiandae ea praesentium. Praesentium suscipit, numquam facere harum fugit nihil, atque quaerat cumque repellat eaque neque provident corrupti laboriosam voluptate cum ratione facilis dicta quas sit unde temporibus. Nulla perspiciatis hic quae totam aliquam numquam neque nobis dolore dignissimos quibusdam quo, culpa, commodi provident. Obcaecati consectetur veritatis omnis reprehenderit iusto. Numquam dolores excepturi placeat eum quaerat. Perferendis maxime saepe provident distinctio vero quos quo itaque velit aliquam tenetur, deleniti repudiandae debitis labore aliquid maiores. Dolore adipisci cupiditate, dolores exercitationem blanditiis laboriosam minima numquam distinctio, placeat veniam voluptates nihil? Reprehenderit perspiciatis aliquid perferendis at! Neque modi labore harum accusantium suscipit consectetur voluptatum. Earum, corporis dolorem! Ab debitis perferendis, omnis excepturi ut libero praesentium mollitia nulla incidunt temporibus, at suscipit consectetur quos impedit magnam ad aspernatur iusto rem, deserunt ipsam molestias voluptatibus beatae maiores quas. Laudantium error eligendi distinctio aspernatur enim possimus quaerat vel blanditiis nihil magni reiciendis, totam neque illum dolores modi atque odit praesentium, nam vero ut eius ad? Pariatur maiores omnis quisquam eum vel optio. Quisquam exercitationem cum amet, impedit quod maiores ut temporibus officiis! Excepturi ducimus libero fuga tenetur. Rerum illum facilis ea quos accusamus distinctio neque. Hic, consequatur a? A rerum incidunt nisi laudantium voluptatem odio delectus itaque enim earum sit, aperiam eveniet. Perferendis optio repellat voluptas facilis repellendus at minus aliquam voluptatibus. Omnis ad saepe quidem ullam ipsam cumque, quibusdam voluptas consequatur nulla, sequi beatae, qui ab ut. Ratione optio eligendi placeat unde ipsam, minima reiciendis architecto culpa, quibusdam aliquam neque, officiis alias laboriosam obcaecati magnam corrupti dolores sit sint ad eaque facilis omnis! Officia necessitatibus voluptatibus beatae natus ex possimus nihil sunt esse, voluptatum quis inventore voluptates atque, blanditiis culpa in alias. Enim et fuga aperiam cumque? Cum modi ea illum consequuntur voluptatem voluptatum obcaecati ab distinctio? Voluptates dolores est facere sunt, hic numquam autem perferendis eveniet eaque ipsum odit illum saepe nihil sit doloremque unde id sed quos praesentium repudiandae officiis! Laborum exercitationem non neque et alias, vel ducimus nisi eos! Eius fugiat rem aperiam, cumque esse molestiae voluptates nobis cum facere vel? Perspiciatis quos, dignissimos natus soluta placeat hic nobis delectus deserunt consequatur atque eligendi omnis beatae ullam corrupti modi recusandae totam itaque odio incidunt eos voluptates! Magnam animi repellendus ipsum beatae doloremque tenetur corporis nesciunt provident facere, et libero. Nisi optio corporis eius magnam! Facilis qui ipsum harum assumenda neque laudantium eaque omnis velit? In officia deserunt nostrum similique eveniet sunt eaque tempora nulla fugiat dolores doloribus ducimus ad quam, eos nisi amet commodi culpa quae! Nostrum ducimus soluta ea maiores esse pariatur modi incidunt aspernatur quisquam facilis asperiores, nam recusandae iusto! Asperiores, alias sapiente possimus qui nostrum nihil aspernatur ex aliquam rerum placeat nesciunt perferendis assumenda est unde. Minus obcaecati voluptatem corporis accusantium aliquam sapiente excepturi nisi iste ipsum quaerat, ut temporibus cum consequatur asperiores ipsa nam praesentium molestias magni atque. Aliquid cum eligendi tenetur architecto at impedit repudiandae rem maxime ducimus culpa animi quaerat officiis corrupti voluptatum quidem itaque totam tempora iste, perspiciatis odit expedita! Non exercitationem adipisci quas nulla error! Iure, unde. Minus accusantium iste, cumque eos aliquid rerum reprehenderit error, ipsum quis expedita iusto voluptates distinctio unde, corporis reiciendis atque quisquam quo saepe? Voluptatum assumenda temporibus, alias dignissimos repellendus explicabo doloribus cupiditate tempora iure accusamus?",
    sus_element: true,
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
