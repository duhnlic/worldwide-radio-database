const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Station = require('../models/Station');
const { auth } = require('./authController');




router.get('/', auth, (req, res) => {
    console.log(res.locals)
    const userQuery = User.find({}).select('-password').populate('stations') 
    userQuery.exec((err, foundUsers) => {
        if (err){
            console.log(err);
            res.status(401).json({ msg: err.message });
        } else {
           res.status(200).json(foundUsers) 
        }
    })
 })

 router.post('/addStationToUser', auth, async (req, res) =>{
    console.log(res.locals)
    const station = await Station.create(req.body)
    const addStationQuery = User.findOneAndUpdate({ username: res.locals.user }, { $addToSet: { stations: station }}, {new: true})
    addStationQuery.exec((err) => {
        if (err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            res.status(200).json({
                msg: `Updated ${res.locals.user} with ${station.name}`
            })
        }
    })
})

router.post('/addStation/:station/:username', auth, (req, res) =>{
    const stationQuery = Station.findOne({ _id: req.params.station })
    stationQuery.exec(( err, station ) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addStationQuery = User.findOneAndUpdate({ username: req.params.username }, { $addToSet: { stations: station._id }}, {new: true})
            addStationQuery.exec((err, updatedUser) => {
                if(err){
                    res.status(400).json({
                        msg: err.message
                    }) 
                } else {
                    console.log(updatedUser);
                    res.status(200).json({
                        msg: `Updated ${updatedUser.username} with ${station.name} `
                    })
                }
            })
        }
    })
})


router.delete('/:username/:station', auth, (req, res) => {
    const deletedStation = User.findOneAndUpdate({username: req.params.username}, {$pull: { stations: req.params.station}});
    console.log(deletedStation)
    deletedStation.exec((error, deletedStation) => {
        if(error) {
            res.status(400).json({
                msg: error.message
            })
        } else {
            res.status(200).json(deletedStation);
        }
    })
})




 router.get('/:username', auth, (req, res) => {
    const userQuery = User.findOne({ username: req.params.username.toLowerCase() }).select('-password').populate('stations')
    userQuery.exec((err, foundUser) => {
        if (err) {
           res.status(400).json({
               msg: err.message
           }) 
        } else {
            res.status(200).json(foundUser)
        }
    })
})


module.exports = router