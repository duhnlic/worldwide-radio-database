const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const { auth } = require('./authController');

// Index
router.get('/', auth, async (req, res) => {
    let filters;
    if(Object.keys(req.query).length > 0){
        filters = {...req.query}
    }
    try {
        if(!filters){
            const foundStations = await Station.find({});
            res.status(200).json(foundStations)
        } else {
            const foundStations = await Station.find({...filters});
            res.status(200).json(foundStations)
        }  
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})
// Create
router.post('/', async (req, res) => {
    try {
        const createdStation = await Station.create(req.body)
        res.status(200).json(createdStation)
    } catch(err){
        res.status(400).json({
            msg: err.message
        })
    }
})
// Read
router.get('/:id', async (req, res) => {
    try {
        const foundStation = await Station.findById(req.params.id);
        res.status(200).json(foundStation)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
// Update
router.put('/:id', async (req, res) => {
    try {
        const updatedStation = await Station.findByIdAndUpdate(req.params.id, req.body, { new: true } )
        res.status(200).json(updatedStation);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
// Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedStation = await Station.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedStation);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
module.exports = router