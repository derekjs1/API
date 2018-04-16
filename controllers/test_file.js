var tar = require('tar-fs')
    , fs = require('fs')
    , zlib = require('zlib')
    , path = require('path')
    , express = require('express')
    , util = require('util')
    , async = require('async');


const exists = util.promisify(fs.exists);
const readdir = util.promisify(fs.readdir);
const lstat = util.promisify(fs.lstat);
const unlink = util.promisify(fs.unlink);
const rmdir = util.promisify(fs.rmdir);
const mkdir = util.promisify(fs.mkdir);

const removeDir = async (dir) => {
    if (await exists(dir)) {
        const files = await readdir(dir);
        await Promise.all(files.map(async (file) => {
            const p = path.join(dir, file);
            const stat = await lstat(p);
            if (stat.isDirectory()) {
                await removeDir(p);
            } else {
                await unlink(p);
                console.log(`Removed file ${p}`);
            }
        }));
        await rmdir(dir);
        console.log(`Removed dir ${dir}`);
    }
}

const make_dir = async (base, dirs) =>{
    let new_dir = base;

    if ( await exists(base)){
        await Promise.all(dirs.map(async (dir)=>{
            new_dir = path.join(new_dir, dir);
            fs.mkdir(new_dir,()=>{});
        }))
        .then(()=>{
            console.log(new_dir);
            return new_dir;
        });

        return new_dir;
    }
}

const bundle = async(dir) =>{
    const files = await readdir('D:/test');
    console.log(files);
    if (files){

        await Promise.all(files.map(async (file)=>{
            
            var fl = path.join('D:\\test',file);
            var stat = await lstat(fl);
            if (stat.isFile()){
                      
                var f = String('D:/test/' + file);
                console.log(f +"\tfile");
                fs.rename(f, String(path.join(dir, file)), (err)=>{

                    console.log("moving " + file);
                    if (err) return err;
                        
                });
            }
            stat = "";

        }))
        .then(()=>{
            tar.pack(dir)
            .pipe(fs.createWriteStream(dir+'.tar'))
            .on('finish', ()=>{
                fs.createReadStream(dir+'.tar')
                .pipe(zlib.createGzip())
                .pipe(fs.createWriteStream(dir+'.tar.gz'))
                .on('finish', ()=>{
                    removeDir(dir);
                    fs.unlink((dir+'.tar'),()=>{
                        console.log('Done');
                    }, err=> { return err;});
                });
    });  
    
        });

    }else
        return false;

    return dir;
}

// function initPromise() {
//     return new Promise(function(res,rej) {
//       res("initResolve");
//     })
//   }
  
//   initPromise().then(function(result) {
//       console.log(result); // "initResolve"
//       return "normalReturn";
//   })
//   .then(function(result) {
//       console.log(result); // "normalReturn"
//   });

var d = path.join("D:", "test", "test_files");
var s = d.toString();

// let init_prom = () =>{
//     return make_dir("D:", ["test", "test_files"]);
// }

// init_prom.then( )


function doAsync() {
    return new Promise ((res,rej) =>{
 //       make_dir(("D:", ["test", "test_files"]) => res (value));
    })
}

//console.log(path.resolve("D:", ['test','testing','most_testing']));
var ret;
var p = make_dir("D:", ["test", "test_files"])
p.then((ret)=> {
    console.log("promise= " + ret);
});
console.log("here: " + p);

// fs.mkdir(s,(err)=>{
//     var dir = bundle(s);
// //    if (dir) pack(dir);
// });
