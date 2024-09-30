import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore"
import { db, notesCollection } from "./firebase"

export default function App() {

    // State declarations
    const [notes, setNotes] = React.useState([])

    const [currentNoteId, setCurrentNoteId] = React.useState("")

    const [tempNoteText, setTempNoteText] = React.useState("")
    
    // If a note is selected, that's the current note, if not it's just the note at index 0
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]

    notes.sort((noteA, noteB) => {
        return noteB.updatedAt - noteA.updatedAt
    })

    // Sync to local storage every time notes state is updated
    React.useEffect(() => {
        const unsubscribe = onSnapshot(notesCollection, snapshot => {
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unsubscribe  
        // localStorage.setItem("notes", JSON.stringify(notes))
    }, [])

    React.useEffect(() => {
        if (currentNote) setTempNoteText(() => currentNote.body)
    }, [currentNote])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [tempNoteText])

    async function createNewNote() {
        const now = Date.now()
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: now,
            updatedAt: now

        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        // setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNoteRef.id)
    }

    async function updateNote(text) {
        const docRef = doc(db, "notes", currentNoteId)
        const updatedNoteObj = {
            body: text,
            updatedAt: Date.now()
        }
        await setDoc(docRef, updatedNoteObj, {merge: true})
    }

    // function updateNote(text) {
    //     setNotes(oldNotes => {
    //         const newArray = []
    //         for (let i = 0; i < oldNotes.length; i++) {
    //             const oldNote = oldNotes[i]
    //             if (oldNote.id === currentNoteId) {
    //                 // Put the most recently-modified note at the top
    //                 newArray.unshift({ ...oldNote, body: text })
    //             } else {
    //                 newArray.push(oldNote)
    //             }
    //         }
    //         return newArray
    //     })
    // }

    async function deleteNote(noteId) {
        const docRef = doc(notesCollection, noteId)
        await deleteDoc(docRef)
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        <Editor
                            // currentNote={currentNote}
                            setTempNoteText={setTempNoteText}
                            tempNoteText={tempNoteText}
                        />
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                </button>
                    </div>

            }
        </main>
    )
}