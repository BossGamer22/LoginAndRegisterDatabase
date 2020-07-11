//Variables
const PORTS = process.env.PORT || 8080;
const Express = require("express");
const j2url = require("j2url");
const fs = require("fs");
const { Console } = require("console");
const Api = Express();

//Tables
var SuccessTable = {
    "success": null
}

var FailedTable = {
    "error": null
}

var DataTable = {
    "success": null,
    "password": null
}

//Main
Api.get("/api/register", function(req, res){
    var Username = j2url.getParam(req.originalUrl, "username")
    var Password = j2url.getParam(req.originalUrl, "password")
    if(Username == "" || Password == ""){
        FailedTable.error = "invalid username or password."
        res.json(FailedTable)
    }else{
        if(fs.existsSync(`datas/${Username}.txt`)){
            FailedTable.error = "username already existed."
            res.json(FailedTable)
        }else{
            fs.writeFile(`datas/${Username}.txt`, Password, function(Error){
                if(Error){
                    FailedTable.error = "failed to register."
                    res.json(FailedTable)
                }else{
                    SuccessTable.success = "registered."
                    res.json(SuccessTable)
                }
            })
        }
    }
})

Api.get("/api/login", function(req, res){
    var Username = j2url.getParam(req.originalUrl, "username")
    if(Username == ""){
        FailedTable.error = "invalid username."
        res.json(FailedTable)
    }else{
        fs.readFile(`datas/${Username}.txt`, { encoding: 'utf-8' }, function(Error, Data){
            if(Error){
                FailedTable.error = "invalid username."
                res.json(FailedTable)
            }else{
                DataTable.success = "valid username."
                DataTable.password = Data
                res.json(DataTable)
            }
        })
    }
})

Api.listen(PORTS, ()=>{
    console.log("Server & API is Running.")
})