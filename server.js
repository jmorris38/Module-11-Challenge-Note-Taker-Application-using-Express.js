const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const db = require('./db/db.json')

//Allows all notes to have a unique ID
const { v4: uuidv4 } = require('uuid');

//Allows public folder to be unblocked
app.use(express.static('public'))
app.use(express.json())

//API Routes
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        ///error logging
        if (err) throw err;
        let dbData = JSON.parse(data);
        //Returns new database
        res.json(dbData)
    });   
})

//POST 
///api/notes receives a new note to save on the request body and add it to db.json, then returns new note to the client.
app.post('/api/notes', (req, res) => {
    //grabs notes from body of request
    const newNote = req.body

    //gives each note a random ID
    newNote.id = uuidv4()

    //adds the note object to the array
    db.push(newNote)

    //update the json file with the new object
    fs.writeFileSync('./db/db.json', JSON.stringify(db))

    //responds with the note object used
    res.json(db)
})


//DELETE
// notes when the button is clicked by removing the note from db.json, saving and showing the updated database on the front end.
app.delete('/api/notes/:id', (req, res) => {
    try {
        const noteIdToDelete = req.params.id;
        
        // Read the existing notes from the db.json file
        const db = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));

        // Filter out the note with the specified ID
        const updatedDb = db.filter((note) => note.id !== noteIdToDelete);

        // Write the updated notes array back to the db.json file
        fs.writeFileSync('./db/db.json', JSON.stringify(updatedDb));

        // Send a success response to the client
        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error('Error deleting note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//HTML Routes
//Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//Notes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

//Wildcard Route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

//App listens with front end on this port
app.listen(PORT, () =>
    //console.log(`App listening on ${PORT}`))
    console.log(`Server is running on http://localhost:${PORT}`));