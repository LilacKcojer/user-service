const express = require('express');
const router = express();
const {getUser, delUser} = require('../repository/userRepo');
const winston = require('winston');

const logger = winston.createLogger({level: 'info'});


router.get('/:email', async function(req, res, next){
    const {email} = req.params;

    logger.info(`Received request to get user with email: ${email}`);

    try{
        const response = await getUser({email});
        res.status(200).send(JSON.stringify(response));
    }
    catch(err){
        console.log(err);
    }
});

router.delete('/:email', async function(req, res, next){
    const {email} = req.params;

    logger.info(`Received request to delete user with email: ${email}`);

    try{
        const response = await delUser({email});
        res.status(200).send(JSON.stringify(response));
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;