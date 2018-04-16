

// switching from non-promised based calls to promise based calls
// utilizing promised based approach
const readFileAsArray = function(file){
    return new Promise((resolve, reject) =>{
        fs.readFile(file, (err,data)=>{
            if (err){
                return reject (err);
            }
    
            const lines = data.toString().trim().split('\n');
            resolve(lines);
        });
    });
};

// utilizing callback approach
// need the empty function to pass the results of the callback
const readFileAsArray = function(file, cb = () =>{}){
    return new Promise((resolve, reject) =>{
        fs.readFile(file, (err,data)=>{
            if (err){
                reject(err);
                return cb (err);
            }
    
            const lines = data.toString().trim().split('\n');
            resolve(lines);
            cb(null,lines);
        });
    });
};

// chaining
readFileAsArray('./numbers')
    .then(lines =>{
        const numbers = lines.map(Number);
        const oddNumbers = numbers.filter(number => number % 2 ==1);
        console.log('odd numbers coount: ', oddNumbers.length);
    })
    .catch(console.error);

// Using async
async function countOdd(){
    try{
        const lines = await readFileAsArray('./numbers');
        const numbers = lines.map(Number);
        const oddCount = numbers.filter(number => number %2==1).length;
        console.log('odd numbers count: ', oddCount);
    } catch(err)
    {
        console.log(err);
    }
}

// Then call the function as normal
countOdd();