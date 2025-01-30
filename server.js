// Requires/imports
const http = require('http');

// Modules and language imports
const mo = require('./modules/utils.js');
const messages = require('./lang/en/en.js');

http.createServer(function(req, res) {

    res.writeHead(200, {'Content-type': 'text/html'});

    const currPath = new mo.ParseReqParam(req).grabCurrUrl();
    const fileController = new mo.FileControler(req);
    
    if (currPath.includes("getDate")) {
        res.end(new mo.GreetUser(req).greet());
    
    } else if (currPath.includes("writeFile")) {
        fileController.writeToFile((msg) => {
            res.end(msg);
        });

    } else if (currPath.includes("readFile")) {
        fileController.readFromFile((data) => {
            res.end(data);
        });

    } else {
        res.end(`<h1>${messages.message.badRequestMsg}</h1>`);
    }

}).listen(8000);