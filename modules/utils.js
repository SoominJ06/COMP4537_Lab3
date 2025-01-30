// Requires/imports
const url = require('url');
const fs = require('fs');

// Language imports
const messages = require('../lang/en/en.js');

// File consts
const myFileName = "file.txt";

// String consts
const emptyString = "";
const textToReplace = "%1";
const newLine = "\n";
const charSet = "utf8";

class ParseReqParam {
    constructor(req) {
        this.currReq = req;
    }

    grabCurrUrl() {
        return this.currReq.url;
    }

    grabParsedUrl() {
        return url.parse(this.grabCurrUrl(), true).query;
    }

    grabUserName() {
        const parsedData = this.grabParsedUrl();
        return parsedData.name ? parsedData.name : emptyString;
    }

    grabTextToWrite() {
        const parsedData = this.grabParsedUrl();
        return parsedData.text ? parsedData.text : emptyString;
    }
}

class GreetUser {
    constructor(req) {
        this.getUrlParam = new ParseReqParam(req);
    }

    getDate() {
        return Date();
    }

    greet() {
        return `<h2 style="color: blue;">${messages.message.getDateMsg.replace(textToReplace, this.getUrlParam.grabUserName())}${Date()}</h2>`;
    }
}

class FileControler {
    constructor(req) {
        this.getUrlParam = new ParseReqParam(req);
    }

    // Using callback to handle the asynchronous behavior of fs.appendFile()
    writeToFile(callback) {
        const textToWrite = this.getUrlParam.grabTextToWrite();
        
        if (!textToWrite) {
            callback(messages.message.textToWriteNotFound);
            return;
        }
    
        fs.appendFile(myFileName, textToWrite + newLine, (err) => {
            if (err) {
                callback(messages.message.fileWriteError);
            } else {
                const msg = messages.message.writeSuccessMsg.replace(textToReplace, textToWrite);
                callback(msg);
            }
        });
    }
    
    // Using callback to handle the asynchronous behavior of fs.readFile()
    readFromFile(callback) {
        fs.readFile(myFileName, charSet, (err, data) => {
            if (err) {
                callback(`${messages.message.fileNotFound}`);
            } else {
                callback(data);
            }
        });
    }
}

module.exports = { ParseReqParam, GreetUser, FileControler };