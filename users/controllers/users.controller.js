const usermodel = require('../models/users.model');
const crypto = require('crypto');



exports.get_user_by_ID = (req, res) => {
    usermodel.search_by_id(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.remove_by_ID = (req, res) => {
    usermodel.remove_by_ID(req.params.userId)
        .then((result)=>{
            res.status(200).send({});
        });
};

exports.update_by_ID = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    
    usermodel.update_user(req.params.userId, req.body)
        .then((result) => {
            res.status(200).send({});
        });

};


exports.list_10 = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 10 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    usermodel.list_10(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;

    usermodel.create_user(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});  // Create status code 
        });
};
