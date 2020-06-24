const express = require("express")
const app = express()
const fs = require("fs")

const cons = require('consolidate')
const path = require('path')

app.use(express.static(__dirname + '/tubaroesvoadores')); 

var users = []
var auth = {}

var isAuthenticated;

var parsedData;

app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(express.urlencoded({ extended: false}))

app.get('/', (req, res) => {
    res.render('indexNL.html')
})

app.get('/home', (req, res) => {
    res.render('index.html');
})

app.get('/login', (req, res) => {
    res.render('logar.html')
})

app.post('/login',(req, res) => {
    fs.stat(`./database/${req.body.email}.json`, (err) => {
        var isLocated

        if (err) {
            console.log("path not found");
            isLocated = false
        } else{
            console.log("path found");
            isLocated = true 
        } 

        if (isLocated) {
            jsonData = fs.readFileSync(`./database/${req.body.email}.json`, "utf8");
            parsedData = JSON.parse(jsonData);
            
            auth = parsedData
            console.log(auth)

            Authenticate(req.body.email, req.body.password)

            console.log(isAuthenticated)

            if (isAuthenticated) {
                res.redirect('/home')
            } else {
                res.redirect('/login')
            }
        } else {
            console.log('nenhum usuario com esse email')
            res.redirect('/login')
        }
    })
})

app.get('/register', (req,res) => {
    res.render('register.html')
})

app.post('/register',(req,res) => {
    users.push({
        id: Date.now().toString(),
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        bloodDonnor: false,
        organDonnor: false,
    })

    fs.stat(`./database/${req.body.email}.json`, (err) => {
        var isFounded
        if (err) {
            console.log("path not found");
            isFounded = false
        } else{
            console.log("path found");
            isFounded = true
        } 
        if (isFounded) {
            res.redirect('/register')
            console.log('data already exist')
        } else {
            res.redirect('/login')
            jsonWrite()
        }
    })
    console.log(users)
})

function jsonWrite() {
    let forSave = users[0]
    console.log(forSave)
    let toWrite = JSON.stringify(users[0]);
    console.log(toWrite);
    fs.writeFile(`./database/${forSave.email}.json`, toWrite, "utf8", (err) => {
        if (err) {
            console.log("error");
        }
    });
}

function Authenticate(email, password) {
    let count = 0;

    if (email !== auth.email) {
        count += 1
    }
    if (password !== auth.password) {
        count += 2
    }
    switch (count) {
        case 1:
            console.log('wrong email')
            isAuthenticated = false
            break;
        case 2:
            console.log('wrong pass')
            isAuthenticated = false
            break;
        case 3:
            console.log('all wrong')
            isAuthenticated = false
            break;
        default:
            console.log('you are loged')
            isAuthenticated = true
            break;
    }
    return isAuthenticated
}

function jsonCheck(email) {
    return fs.stat(`./database/${email}.json`, (err) => {
        if (err) {
            console.log("path not found");
            isFounded = false
        } else{
            console.log("path found");
            isFounded = true
        } 
        return isFounded
    }) 
}

app.listen(3000)
