const express = require('express'); 
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();            
const port = 5000;                  

const analysisRoute = require('./routes/analysisRoute')

app.use(express.static(path.join(__dirname, 'public')));

// app.set("views",path.join(__dirname,"views"))
// app.set("view engine","ejs")

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'uploads', 
    filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const imageUpload = multer({
    storage: imageStorage,
    // limits: {
    //   fileSize: 30000000 // 1000000 Bytes = 1 MB
    // },
    fileFilter(req, file, cb) {
      // if (!file.originalname.match(/\.(pdf)$/)) { 
      //    // upload only pdf
      //    return cb(new Error('Please upload a Image'))
      //  }
     cb(undefined, true)
  }
}) 

// For Single image upload
app.post('/upload', imageUpload.single('file'), (req, res) => {
    console.log(res.statusCode)
    res.send(req.file)
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})
app.use('/analyze', analysisRoute);

app.get('/', (req, res) => {        
    res.sendFile(path.join(__dirname, '/public/index.html'));      //server responds by sending the index.html file to the client's browser 
});


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
