const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");

function feltolt(data) {
    let emailek = [];
    let sorok = data.split("\r\n");
    for (let sor of sorok) {
        let s = sor.split(";");
        let email = { felado:s[0], cimzett:s[1], mikor:s[2], hossz:s[3] };
        emailek.push(email);
    }
    return emailek;
}

let emailek = [];
fs.readFile("email.csv", "utf-8", (error, data) => {
    if (error) console.log("File read error"); else emailek = feltolt(data);
});

let server = http.createServer((request, response) => {
    let rUrl = url.parse(request.url, true);
    let pathname = rUrl.pathname;
    let query = rUrl.query;

    response.writeHead(200, "OK", {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*"
    });

    let json = { Error: "Invalid request" };

    if (pathname == "/feladok") json = feladok();
    if (pathname == "/kuldott" && query.felado) json = felado(query);
    if (pathname == "/kuldott" && query.felado && query.tol) json = feladoTol(query);
    if (pathname == "/kuldott" && query.felado && query.tol && query.ig) json = feladoTolIg(query);

    if (pathname == "/kuldott" && query.cimzett) json = cimzett(query);
    if (pathname == "/kuldott" && query.cimzett && query.tol) json = cimzettTol(query);
    if (pathname == "/kuldott" && query.cimzett && query.tol && query.ig) json = cimzettTolIg(query);

    response.end(JSON.stringify(json));
});

server.listen(88);
console.log("Server is running on port :88");

function feladok() {
    let set = new Set();
    for (let email of emailek) set.add(email.felado);
    return [ ...set ].sort();
}

function felado(query) {
    let tomb = []
    for (let email of emailek) {
        if (email.felado == query.felado) {
            tomb.push(email);
        }
    } 
    return [ ...tomb ].sort();
}

function feladoTol(query) {
    let tomb = []
    for (let email of emailek) {
        if (email.felado == query.felado && email.mikor >= query.tol) {
            tomb.push(email);
        }
    } 
    return [ ...tomb ].sort();
}


function feladoTolIg(query) {
    let tomb = []
    for (let email of emailek) {
        if (email.felado == query.felado && email.mikor >= query.tol && email.mikor <= query.ig) {
            tomb.push(email);
        }
    } 
    return [ ...tomb ].sort();
}

function cimzett(query) {
    let tomb = []
    for (let email of emailek) {
        if (email.cimzett == query.cimzett) {
            tomb.push(email);
        }
    } 
    return [ ...tomb ].sort();
}

function cimzettTol(query) {
    let tomb = []
    for (let email of emailek) {
        if (email.cimzett == query.cimzett && email.mikor >= query.tol) {
            tomb.push(email);
        }
    } 
    return [ ...tomb ].sort();
}


function cimzettTolIg(query) {
    let tomb = []
    for (let email of emailek) {
        if (email.cimzett == query.cimzett && email.mikor >= query.tol && email.mikor <= query.ig) {
            tomb.push(email);
        }
    } 
    return [ ...tomb ].sort();
}