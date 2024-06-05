const express = require('express');
const router = express();
const {addUser} = require('../repository/userRepo');
const winston = require('winston');

const logger = winston.createLogger({level: 'info'});

/* GET home page. */
router.post('/', async function(req, res, next) {
    const {email} = req.body;

    logger.info(`Received request to add user ${email}`);

    try{
        const response = await addUser({email});
        res.send(200).json(JSON.stringify(response));
    }
    catch (err){
        console.log(err);
    }
});

module.exports = router;