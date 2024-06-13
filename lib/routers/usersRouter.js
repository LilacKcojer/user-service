const express = require('express');
const router = express();
const {addUser, getUsers} = require('../repository/usersRepo');
const winston = require('winston');

const logger = winston.createLogger({level: 'info'});

/* GET home page. */
router.post('/', async function(req, res, next) {
    const {email} = req.body;

    logger.info(`Received request to add user ${email}`);

    try{
        const response = await addUser({email});
        res.status(200).send(JSON.stringify(response));
    }
    catch (err){
        console.log(err);
    }
});

router.get('/', async function(req, res, next){
    logger.info('Received request to get all users');

    try{
        const response = await getUsers();
        res.status(200).send(JSON.stringify(response));
    }
    catch(err){
        console.log(err);
    }
});

module.exports = router;