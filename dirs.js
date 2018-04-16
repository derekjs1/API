
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');


// Core module so it is already there without special includes

/********************************
Navigate Directory that directories_file.js is called from. 
Asynchronous
*********************************/
// directory to look at, callback
exports = module.exports =
{
getDir(x, logo) {
    var ret;
    fs.readdir(x, (err,files) => {
        if (err)
        {
            console.log(err);
            return null;
        }
        else
        {
            files.forEach(file =>{
                if (err)
                {
                    console.log(err);
                    return null;
                }
                
                if(fs.statSync(x+'/'+file).isFile() && logo)
                {
                    x = file;
                }
                if(fs.statSync(x+'/'+file).isDirectory() && !logo)
                {
                    x = file;
                }
            });
        }
    });
    console.log(x);
    return x;
},
createDir(x){
    
    var defDir=String(x);
    console.log(defDir);

    fs.mkdir(defDir, (err) =>{
        if (err)
           console.log(err);
       else
           console.log('Dir created');
   
   });
    return defDir;
},
deleteDir(root, model){

    var toBeRemoved = String( __dirname + '/stores/' + root);
    fs.rmdir(toBeRemoved, (err) =>{

        if (err)
            console.log(err);
        else
            console.log('Success');
    
    });
}
}

/*

// or for posterity synchronous method
// contentSync will get the contents of the directory
var contentSync = fs.readdirSync('dirA');

///*************************************
 //* Adding and Removing Directories
 //*************************************

 // Make directory
fs.mkdir('dirA/dirB', (err) =>{
     if (err)
        consoloe.log(err);
    else
        consoloe.log('Dir created');

});

// Statistics of files
                /*
                fs.stat((x+'\\'+file), (err, stats) =>{
                    if (err)
                    {
                        console.log(err);
                        ret = false;
                    }
                    else if (stats.isFile() && logo)
                    {
                        ret = true;
                    }
                    else if (stats.isDirectory() && !logo)
                    {
                        ret = true;
                    }
                });
                if (ret)
                {
                    return file;
                }
                

// Removing directories

///****************************
// * Reading files
// ***************************
// (File to read, encoding, error callback)
// Asynchronous Processing, when the file is ready to be returned in the buffer the callback is initiated
 fs.readFile('dirA/fileA.txt', 'utf8', (err,data) =>{
    if (err)
        console.log(err);
    else
        console.log(data); // data from the file, human readable with proper encoding type
 });

 // Synchronous Method: block program until contents is fulfilled, delay based on file size
 var contents = fs.readFileSync('dirA/fileA.txt', 'utf-8');

 ///****************************
 // * Write Files
 // ****************************

var data1 = 'Some stuff to write about';

// Overwrites whatever the file you have created is.
// path to file with filename, data to be written, callback
fs.writeFile('dirA/test.txt', data1, (err)=>{
    if (err)
        console.log(err);
    else
        console.log(data); 
});

// Does not overwrite file just appends, will create if does not exist prior
// fs.appendFile('directory/filetowriteto.txt', data, (err)=>{});

///***************************
// * Watching Directories
// ****************************
// Triggers event  that logs when a directory is being modified
// unstable as dependent on how the native file system handles stuff
// applies to contiguous watch function, {persistent:false} applies to non-contiguous

fs.watch('dirA', {persistent: true}, (event, filename) =>{
    if (event == 'rename')
        console.log('rename file ' + filename);
    else if(even == 'change')
        console.log('change even ' + filename);
});

*/

//module.exports = router;
