const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const router = express.Router();
const { body, validationResult } = require('express-validator')

//ROUTE:1 Fetch all notes of a user GET Login required : /api/notes/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal server error')
    }

})

//ROUTE:2 Add a new note POST Login required : /api/notes/addnote
router.post('/addnote', fetchuser, [
    body('title', 'title should not be less than 3 characters').isLength({ min: 3 }),
    body('description', 'description should not be less than 5 characters').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        const note = Note({
            title, description, tag, user: req.user.id
        })
        const savedNote = await note.save()

        res.json(savedNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal server error')
    }

})

//ROUTE:3 Update a note PUT Login required : /api/notes/updatenote/:id
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body
    try {
        //create a newnote object
        const newNote = {}
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }

        //check whether note exists
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send('note not found')
        }
        //check whether note belongs to user
        if (req.user.id !== note.user.toString()) {
            return res.status(401).send('not allowed')
        }
        //find the note to be updated and update it
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.send(note)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal server error')
    }
})

//ROUTE:4 Delete a note DELETE Login required : /api/notes/deletenote/:id
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //check whether note exists
        let note = await Note.findById(req.params.id)
        if (!note) {
            return res.status(404).send('note not found')
        }
        //check whether note belongs to user
        if (req.user.id !== note.user.toString()) {
            return res.status(401).send('not allowed')
        }
        //find the note to be updated and update it
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ 'Success': 'Note has been dleted', note: note })
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal server error')
    }
})

module.exports = router;