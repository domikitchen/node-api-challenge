const express = require('express');

const Projects = require('../helpers/projectModel.js');
const Actions = require('../helpers/actionModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong retrieving the projects" });
        });
});

router.post('/', validProjectInputs, (req, res) => {
    const project = req.body;

    Projects.insert(project)
        .then(response => {
            res.status(201).json(response);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while uploading this project" });
        });
});

router.get('/:id', validProjectId, (req, res) => {
    const id = req.params.id;

    Projects.get(id)
        .then(project => {
            res.status(200).json(project);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong retrieving this project" });
        });
});

router.put('/:id', validProjectId, validProjectInputs, (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    Projects.update(id, changes)
        .then(project => {
            res.status(202).json(project);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while updating this project" });
        });
});

router.delete('/:id', validProjectId, (req, res) => {
    const id = req.params.id;

    Projects.remove(id)
        .then(response => {
            res.status(205).end();
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while removing this user" });
        });
});

router.get('/:id/actions', validProjectId, (req, res) => {
    const projectId = req.params.id;

    Projects.getProjectActions(projectId)
        .then(actions => {
            res.status(200).json(actions);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong retreiving the actions" });
        });
});

router.post('/:id/actions', validProjectId, validActionInputs, (req, res) => {
    const id = req.params.id;
    const action = req.body;

    action.project_id = id;

    Actions.insert(action)
        .then(actio => {
            res.status(201).json(actio);
        })
        .catch(error => {
            res.status(500).json({ message: "Something went wrong while adding this action" });
        });
})

function validProjectId(req, res, next) {
    const id = req.params.id;

    Projects.get(id)
        .then(project => {
            if(project){
                next();
            }
            else{
                res.status(400).json({ error: "Please provide a valid project id" });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
};

function validProjectInputs(req, res, next) {
    const projectInput = req.body;

    if(projectInput === undefined){
        res.status(400).json({ error: "Missing project data" });
    }
    else if(projectInput.name === undefined || projectInput.description === undefined){
        res.status(400).json({ error: "Please provide valid name and/or description" });
    }
    else{
        next();
    }
};

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