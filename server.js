const express = require("express");
const path = require("path");
const dbnotes = require("./db/db.json");
const fs = require("fs");
//Start server on Port 5000
const app = express();
const PORT = process.env.PORT || 5000;

// Use express middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// /apit/notes route
app.get("/api/notes", function (req, res) {
    res.json(dbnotes);
});

// Add a note using addNote function
app.post("/api/notes", (req, res) => {
    let newNote = addNote(req.body, dbnotes);
    console.log("New notes added")
    res.json(newNote);
});

// delete a selected note using deleteNote function
app.delete("/api/notes/:id", (req, res) => {
    console.log(req.params.id)
    deleteNote(req.params.id, dbnotes);
    console.log("The note has been deleted")
    res.json(true);
});


// HTML routes

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Add new note
function addNote(req, db) {

    let note = req;
    db.push(note);
    req.id = db.length;
    // update the file
    fs.writeFileSync(
        path.join(__dirname, "/db/db.json"),
        JSON.stringify(db, null, 1)
    );
    return note;
}

// delete selected note
function deleteNote(id, db) {

    for (i = 0; i < db.length; i++) {
        if (id == db[i].id) {
            console.log(db.indexOf(id));
            db.splice(i, 1);
            console.log(db);
            for (j = 0; j < db.length; j++) {
                db[j].id = j+1
            }
            // update the file 
            fs.writeFileSync(
                path.join(__dirname, "./db/db.json"),
                JSON.stringify(db, null, 1)
            );
        }
    }   
}

// Listener
app.listen(PORT, function(){
    console.log(`App on port ${PORT}!`);
});