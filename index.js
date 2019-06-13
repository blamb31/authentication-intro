const express = require('express')
const app = express()
const session = require('express-session')
const massive = require('massive')
require('dotenv').config()
const authCtrl = require('./controllers/auth')

const {SESSION_SECRET, SERVER_PORT, CONNECTION_STRING} = process.env

massive(CONNECTION_STRING).then( (db) => {
    app.set('db', db)
    console.log(`db is connected`)
})

app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 
    }
}))

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)
app.get('.auth/currentUser', authCtrl.currentUser)


app.listen(SERVER_PORT, () => console.log(`Listening on Port: ${SERVER_PORT}`))
