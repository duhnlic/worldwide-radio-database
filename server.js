require('dotenv').config() 
const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET_KEY
const {hash, jsonAuth, auth} = require('./controllers/authController');
const User = require('./models/User')
const app = express();
const PORT = process.env.PORT || 8000;

//database and middleware
app.use(express.json())
app.use((req, res, next) => {
    next()
})
app.use(cors())
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    connectTimeoutMS: 3000
},(err, res)=>{
    try{
        console.log("Mongo is Connected")
    } catch(err) {
        console.log(err)
    }
})
mongoose.connection.once('connected', () => console.log('Bongo Bongo Bongo I\'m Connected to the Mongo'))

app.use('/stations', require('./controllers/stationController'))
app.use('/user', require('./controllers/userController'))

app.get('/', (req, res) => {
    res.send(`<h1>Worldwide Internet Radio Database</h1><h3>created by B. Stewart</h3><p>join for access at <a href='https://www.peblradio.com'>Pebl Radio</a></p>`)
})

// login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hash(password);
    User.findOne({ username },  (err, foundUser) => {
        if(err){
            res.status(400).json({ msg: err.message })
        } else {
            if(foundUser && bcrypt.compareSync(hashedPassword, foundUser.password)){
                const token = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username    
                }, SECRET)
                res.status(200).json({ 
                    token,
                    username: foundUser.username
                })
            } else {
                res.status(500).json({
                    problem: 'The comparison did not work, did you change your hash algorithm?'
                })
            }
        }
    })
})

// register
app.post('/register', (req, res, next) =>{
    console.log('look at me I am middleware')
    next()
    },
    (req, res) =>{
    const passwordHash = hash(req.body.password)
    req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))

    User.create(req.body, (err, createdUser) =>{
        if(err){
            console.log(err)
            res.status(400).json({
                msg: err.message
            })
        } else {
            const token = jwt.sign({
                id: createdUser._id,
                username: createdUser.username
            }, SECRET)
            res.status(200).json({
                token,

            })
        }
    })
})

app.listen(PORT, () => console.log('Kima! I am here on PORT: ', PORT))