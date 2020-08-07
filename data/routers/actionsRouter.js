const express = require('express');

const Actions = require('../helpers/actionModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while retrieving the actions" });
        });
});

router.get('/:id', validActionId, (req, res) => {
    const id = req.params.id;

    Actions.get(id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while retrieving this action" });
        });
});

router.put('/:id', validActionId, validActionInputs, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    Actions.update(id, changes)
        .then(action => {
            res.status(202).json(action);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while updating this action" });
        });
});

router.delete('/:id', validActionId, (req, res) => {
    const id = req.params.id;

    Actions.remove(id)
        .then(response => {
            res.status(205).end();
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while removing this action" });
        });
});

function validActionId(req, res, next) {
    const id = req.params.id;

    Actions.get(id)
        .then(action => {
            if(action){
                next();
            }
            else{
                res.status(400).json({ error: "Please provide a valid action id" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
}

function validActionInputs(req, res, next){
    const action = req.body;

    if(action === undefined){
        res.status(400).json({ error: "Missing action data" });
    }
    else if(action.description === undefined || action.notes === undefined){
        res.status(400).json({ error: "Please provide valid description and/or notes" });
    }
    else{
        next();
    }
}

module.exports = router;