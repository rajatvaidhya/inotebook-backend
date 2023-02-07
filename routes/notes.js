const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//ROUTE 1 : Get all the notes using GET : /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req,res) => {

    try {

    const notes = await Note.find({user : req.user.id});
    res.json(notes);
        
    } catch (error) {

        console.error(error.message);
        res.status(500).send('some error occured0.');
        
    }
})



//ROUTE 2 : Add all the notes using POST : /api/notes/addnote
router.post('/addnote', fetchuser, [

    body('title', 'Enter valid title.').isLength({ min: 5 }),
    body('description', 'Description should be minimum 5 words long.').isLength({min : 5})

] , async (req,res) => {

    try {

        const {title, description, tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
    
        const note = new Note({
            title,description,tag,user : req.user.id
        })
    
        const savedNote = await note.save();
    
        res.json(savedNote);
        
    } catch (error) {
        
        console.error(error.message);
        res.status(500).send('some error occured1.');
    }
    
})



//ROUTE 3 : Update a existing note using PUT : /api/notes/updatenote
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const {title, description, tag} = req.body;

    //Create a new note object
    
    const newNote = {};

    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};


    //Find and Update a Note

    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Fouynd")};

    if(note.user.toString() !== req.user.id)
    {
        return res.status(401).send("Not allowed!");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
    res.json(note);

})



//ROUTE 4 : Delete a existing note using DELETE : /api/notes/deletenote
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    //Find and Update a Note

    try
    {
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")};
    
        if(note.user.toString() !== req.user.id)
        {
            return res.status(401).send("Not allowed!");
        }
    
        note = await Note.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Note has been deleted!", note : note});
    
    }

    catch(error)
    {
        console.error(error.message);
        res.status(500).send('some error occured2.');
    }

 
})

module.exports = router;