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

    grabPathSegments() {
        return url.parse(this.grabCurrUrl(), true).pathname.split('/');
    }

    grabUserName() {
        const parsedData = this.grabParsedUrl();
        return parsedData.name ? parsedData.name : emptyString;
    }

    grabTextToWrite() {
        const parsedData = this.grabParsedUrl();
        return parsedData.text ? parsedData.text : emptyString;
    }

    grabFileName() {
        const parsedSegments = this.grabPathSegments();
        return parsedSegments[parsedSegments.length - 1] ? parsedSegments[parsedSegments.length - 1] : myFileName;
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
        return `<h1 style="color: blue;">${messages.message.getDateMsg.replace(textToReplace, this.getUrlParam.grabUserName())}${Date()}</h1>`;
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
            callback(`<h1>${messages.message.textToWriteNotFound}</h1>`);
            return;
        }
    
        fs.appendFile(myFileName, textToWrite + newLine, (err) => {
            if (err) {
                callback(`<h1>${messages.message.fileWriteError}</h1>`);
            } else {
                const msg = `<h1>${messages.message.writeSuccessMsg.replace(textToReplace, textToWrite)}</h1>`;
                callback(msg);
            }
        });
    }
    
    // Using callback to handle the asynchronous behavior of fs.readFile()
    readFromFile(callback) {
        const reqFileName = this.getUrlParam.grabFileName();
        fs.readFile(reqFileName, charSet, (err, data) => {
            if (err) {
                callback(this.insertReadFileError(reqFileName));
            } else {
                callback(data);
            }
        });
    }

    insertReadFileError(fileName) {
        if (fileName === myFileName) {
            return `<h1>${messages.message.fileIsEmpty}</h1>`;
        } else if (fileName === "readFile") {
            return `<h1>${messages.message.badRequestMsg}${messages.message.fileRequestNotFound}</h1>`;
        } else {
            return `<h1>${messages.message.fileNotFound.replace(textToReplace, fileName)}</h1>`;
        }
    }
}

module.exports = { ParseReqParam, GreetUser, FileControler };