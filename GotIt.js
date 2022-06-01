/**
 * NodeJs Server-Side Example for Fine Uploader (traditional endpoints).
 * Maintained by Widen Enterprises.
 *
 * This example:
 *  - handles non-CORS environments
 *  - handles delete file requests assuming the method is DELETE
 *  - Ensures the file size does not exceed the max
 *  - Handles chunked upload requests
 *
 * Requirements:
 *  - express (for handling requests)
 *  - rimraf (for "rm -rf" support)
 *  - multiparty (for parsing request payloads)
 *  - mkdirp (for "mkdir -p" support)
 */

// Dependencies
var express = require("express"),
    fs = require("fs"),
    rimraf = require("rimraf"),
    mkdirp = require("mkdirp"),
    multiparty = require('multiparty'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser'),
    moment = require('moment'),

// moveFile = require('dank-movefile')
// paths/constants
    fileInputName = process.env.FILE_INPUT_NAME || "qqfile",
    publicDir = process.env.PUBLIC_DIR,
    nodeModulesDir = process.env.NODE_MODULES_DIR,
    uploadedFilesPath = process.env.PWD + "/uploadFiles",
    // uploadedFilesPath = process.env.UPLOADED_FILES_DIR,
    // uploadedFilesPath = "/Users/imac08/IdeaProjects/Challange7David/uploadFiles",
    chunkDirName = "chunks",
    // port = process.env.SERVER_PORT || 8000,
    port = 8000,
    maxFileSize = process.env.MAX_FILE_SIZE || 0; // in bytes, 0 for unlimited
// app.use(express.static(publicDir));
// app.use("/node_modules", express.static(nodeModulesDir));
app.use(express.static(__dirname));
// console.log(process.env.FILE_INPUT_NAME)
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "10.11.90.15",
    user: "AppUser",
    password: "Special888%",
    database: "Study"
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// const moveFile = require('@npmcli/move-file');
//
// (async () => {
//     await moveFile('source/unicorn.png', 'destination/unicorn.png');
//     console.log('The file has been moved');
// })();


// moveFile('uploadFiles/testmove.js', 'DataDir/', function (err) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('move success');
//     }
// });


app.listen(port);
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
});

// app.set('views', path.join(__dirname, './', 'views'));
// app.engine('ejs', require('ejs').renderFile)
// app.set('view engine', 'ejs');
// app.use("scripts",express.static('scripts'));
//console.log(__dirname)
// routes
// app.use(express.static(__dirname + '/views'));



//

// app.get('/server/upload', onUpload, function (req, res) {
//     res.json({ success: 'True' })
// });
app.post('/uploadFiles', onUpload);
// app.delete("/uploads/:uuid", onDeleteFile);

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, '/index0.html'));
// });


console.log('Server started at http://localhost:' + port);
// var oldPath = ""
// var newPath = ""
// fs.rename(oldPath, newPath, function(err, data){
//     if(err) throw err
//
// })

app.post(function(req, res, next){
    next();
});
app.get('/',function(req,res) {
    var FetchTable = "SELECT * FROM Study.Challenge7David ORDER BY ID desc"
    con.query(FetchTable, function(err, rows) {
        res.render('index.ejs', {

            // data: JSON.stringify(rows)
            data: rows


        });
    //     con.query(FetchTable, function (err, rows) {
    //         if (err) {
    //             res.json({
    //                 msg:"Error inserting"
    //             });
    //         } else {
    //             res.json({
    //
    //                 data: rows
    //
    //
    //
    //             });
    //             console.log("Record Inserted Successfully")
    //         }
    //
    //     });
    });


    // res.sendFile("/Users/imac08/IdeaProjects/Challange7David/views/manupload.html")

});
//
var timestamp = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
for(var e = 0;e=e;e++) {
    console.log(timestamp)
}

// var filename = file.name
// console.log(fields.qqfilename)



con.on('error', function(err) {
    console.log("[mysql error]",err);
});
// var querystatement = "INSERT INTO Challenge7David (ID, LastName, FirstName) VALUES ('1', 'Company Inc', 'Highway 37')";
//     con.query(querystatement, function (err, result) {
//         if (err) throw err;
//         console.log("1 record inserted");
//     });
// var onUpload;
var test1;
function onUpload(req, res) {
    var form = new multiparty.Form();

   form.parse(req, function(err, fields, files) {

        var partIndex = fields.qqpartindex;
        // text/plain is required to ensure support for IE9 and older
        res.set("Content-Type", "text/plain");

        if (partIndex == null) {
            onSimpleUpload(fields, files[fileInputName][0], res);
            // console.log(files[fileInputName][0]);

        }

        else {
            onChunkedUpload(fields, files[fileInputName][0], res);
        }
        test1 = files[fileInputName][0]

       if (test1.name[0] != undefined) {
           app.post("/form", function(req, res) {


               // var querystatement = 'INSERT INTO Challenge7David (FirstName, LastName, Age) VALUES("' + req.body.Firstname + '","' +  req.body.Lastname +'","' + req.body.Age+ '");';
               var querystatement = 'INSERT INTO Challenge7David (FirstName, LastName, Age, TimeUploaded, FileName, Status) VALUES("' + req.body.Firstname + '","' +  req.body.Lastname +'","' + req.body.Age+ '","' + moment(new Date()).format('YYYY-MM-DD HH:mm:ss') +'","' + test1.name[0] + '","' + "Pending..." + '");';

               // var teststatement = 'SELECT * FROM Study.Challenge7David"' + req.body.Firstname '"'
               // var querystatement = 'INSERT INTO Challenge7David (ID, LastName, FirstName) VALUES(ID + 1,"' + req.body.Firstname + '","';
               // console.log(querystatement)

               con.query(querystatement, function (err, result) {
                   if (err) {
                       res.json({
                           msg:"Error inserting"
                       });
                   } else {
                       res.json({

                           msg:"success"



                       });
                       console.log("Record Inserted Successfully")
                   }

               });
           });
       }

    });

}


app.post("/approve", function (req, res) {
    console.log(req.body.approve)
    fs.rename("/Users/imac08/IdeaProjects/Challange7David/uploadFiles/" + req.body.approve, "/Users/imac08/IdeaProjects/Challange7David/DataDir/" + req.body.approve, function (err) {
        if (err)  {
            res.json({
                msg: "error"

            })
            console.log(err)
        } else {
            res.json({
                msg: "success"
            })

            var approvestatment = 'UPDATE Challenge7David SET Status = "Approved!" WHERE FileName =  "' + req.body.approve + '";';
            con.query(approvestatment, function (err, result) {
                if (err) {
                    // res.json({
                    //     msg:"Error inserting"
                    // });
                    console.log(err)
                } else {
                    // res.json({
                    //
                    //     msg:"success"
                    //
                    //
                    //
                    // });
                    console.log("Approved!")
                }

            });

        }
    })



})
// var filenamefunc = function filenamefunc(fields, files){
//
//     return files[fileInputName][0]
// }

// var response = onUpload();
// console.log(response)

function onSimpleUpload(fields, file, res) {
    var uuid = fields.qquuid,
        responseData = {
            success: false
        };

    file.name = fields.qqfilename;

    if (isValid(file.size)) {
        moveUploadedFile(file, uuid, function() {
                responseData.success = true;
                res.send(responseData);
            },
            function() {
                responseData.error = "Problem copying the file!";
                res.send(responseData);
            });
    }
    else {
        failWithTooBigFile(responseData, res);
    }
}

// function onChunkedUpload(fields, file, res) {
//     var size = parseInt(fields.qqtotalfilesize),
//         uuid = fields.qquuid,
//         index = fields.qqpartindex,
//         totalParts = parseInt(fields.qqtotalparts),
//         responseData = {
//             success: false
//         };
//
//     file.name = fields.qqfilename;
//
//     if (isValid(size)) {
//         storeChunk(file, uuid, index, totalParts, function() {
//                 if (index < totalParts - 1) {
//                     responseData.success = true;
//                     res.send(responseData);
//                 }
//                 else {
//                     combineChunks(file, uuid, function() {
//                             responseData.success = true;
//                             res.send(responseData);
//                         },
//                         function() {
//                             responseData.error = "Problem conbining the chunks!";
//                             res.send(responseData);
//                         });
//                 }
//             },
//             function(reset) {
//                 responseData.error = "Problem storing the chunk!";
//                 res.send(responseData);
//             });
//     }
//     else {
//         failWithTooBigFile(responseData, res);
//     }
// }

function failWithTooBigFile(responseData, res) {
    responseData.error = "Too big!";
    responseData.preventRetry = true;
    res.send(responseData);
}
//
// function onDeleteFile(req, res) {
//     var uuid = req.params.uuid,
//         // dirToDelete = uploadedFilesPath + uuid;
//         dirToDelete = uploadedFilesPath;
//
//     rimraf(dirToDelete, function(error) {
//         if (error) {
//             console.error("Problem deleting file! " + error);
//             res.status(500);
//         }
//
//         res.send();
//     });
// }

function isValid(size) {
    return maxFileSize === 0 || size < maxFileSize;
}

function moveFile(destinationDir, sourceFile, destinationFile, success, failure) {
    // console.log(destinationDir + "This is the Destination directory")
    mkdirp(destinationDir, function(error) {
        var sourceStream, destStream;

        if (error) {
            console.error("Problem creating directory " + destinationDir + ": " + error);
            failure();
        }
        else {
            sourceStream = fs.createReadStream(sourceFile);

            destStream = fs.createWriteStream(destinationFile);

            sourceStream
                .on("error", function(error) {
                    console.error("Problem copying file: " + error.stack);
                    destStream.end();
                    failure();
                })
                .on("end", function(){
                    destStream.end();
                    success();
                })
                .pipe(destStream);
        }
    });
}

function moveUploadedFile(file, uuid, success, failure) {
    /* var destinationDir = uploadedFilesPath + uuid + "/", */

    var destinationDir = uploadedFilesPath + "/"
        fileDestination = destinationDir + file.name;
        // console.log(fileDestination)

    moveFile(destinationDir, file.path, fileDestination, success, failure);







}

//
//
// var access = new moveUploadedFile(file, uuid, success, failure)
// var oldPath = fileDestination
// var newPath = "DataDir/" + file.name
// if (file.name = file.name){
//     newPath + "1"
// }
// fs.rename(oldPath, newPath, function(err, data){
//     if(err) throw err
//     console.log("File Moved Successfully")
// })



// function storeChunk(file, uuid, index, numChunks, success, failure) {
//     var destinationDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
//         // var destinationDir = uploadedFilesPath + "/" + chunkDirName + "/"
//         chunkFilename = getChunkFilename(index, numChunks),
//         fileDestination = destinationDir + chunkFilename;
//
//     moveFile(destinationDir, file.path, fileDestination, success, failure);
// }
//
// function combineChunks(file, uuid, success, failure) {
//     var chunksDir = uploadedFilesPath + uuid + "/" + chunkDirName + "/",
//         destinationDir = uploadedFilesPath + uuid + "/",
//         fileDestination = destinationDir + file.name;
//
//
//     fs.readdir(chunksDir, function(err, fileNames) {
//         var destFileStream;
//
//         if (err) {
//             console.error("Problem listing chunks! " + err);
//             failure();
//         }
//         else {
//             fileNames.sort();
//             destFileStream = fs.createWriteStream(fileDestination, {flags: "a"});
//
//             appendToStream(destFileStream, chunksDir, fileNames, 0, function() {
//                     rimraf(chunksDir, function(rimrafError) {
//                         if (rimrafError) {
//                             console.log("Problem deleting chunks dir! " + rimrafError);
//                         }
//                     });
//                     success();
//                 },
//                 failure);
//         }
//     });
// }
//
// function appendToStream(destStream, srcDir, srcFilesnames, index, success, failure) {
//     if (index < srcFilesnames.length) {
//         fs.createReadStream(srcDir + srcFilesnames[index])
//             .on("end", function() {
//                 appendToStream(destStream, srcDir, srcFilesnames, index + 1, success, failure);
//             })
//             .on("error", function(error) {
//                 console.error("Problem appending chunk! " + error);
//                 destStream.end();
//                 failure();
//             })
//             .pipe(destStream, {end: false});
//     }
//     else {
//         destStream.end();
//         success();
//     }
// }
//
// function getChunkFilename(index, count) {
//     var digits = new String(count).length,
//         zeros = new Array(digits + 1).join("0");
//
//     return (zeros + index).slice(-digits);
// }
