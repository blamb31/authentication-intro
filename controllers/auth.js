const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        //user inputs data: name, email, password
        //Check if email is in db, send 409 status
        // Create a salt
        // hash password and salt
        //store name email and hash into table
        try {
            const db = req.app.get('db')
            const {name, email, password} = req.body
    
            let users = await db.findUserByEmail(email)
            let user = users[0]
    
            if(user) {
                return res.status(409).send('Email already in db')
            }
    
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(password, salt)
    
            let response = await db.createUser(name, email, hash)
            let newUser = response[0]
    
            delete newUser.password
    
            req.session.user = newUser
    
            res.send(req.session.user)

        }catch(error){
            console.log('there was an error', error)
            res.status(500).send(error)
        }

    },
    login: async (req, res) => {
        //user inputs data: email, password
        //get user by email from db
        //if no user, send 401 status
        //compare password with hash using bcrypt
        //if password doesnt match, send 401 status
        //if the match, add user to session
        try {
            const db = req.app.get('db')
            const {email, password} = req.body

            let users = await db.findUserByEmail(email)
            let user = users[0]

            if(!user){
                return res.status(401).send('Username or Password is incorrect')
            }

            let isAuthenticated = bcrypt.compareSync(password, user.password)

            if(!isAuthenticated){
                return res.status(401).send('Username or Password is incorrect')
            }

            delete user.password
            req.session.user = user
            res.send(req.session.user)

        }catch(error){
            console.log('there was an error', error)
            res.status(500).send(error)
        }
    },
    logout: (req, res) => {
        req.session.destroy()
        res.sendStaus(200)
    },
    currentUser: (req, res) => {
        res.send(req.session.user)
    }

}