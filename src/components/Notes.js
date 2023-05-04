import React, { useContext, useEffect, useState, useRef } from 'react'
import noteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem'
import AddNote from './AddNote'
import { useNavigate } from 'react-router-dom'

const Notes = (props) => {
    const context = useContext(noteContext)
    const { notes, getNotes, editNote } = context
    const [note, setNote] = useState({ id: '', title: '', description: '', tag: 'default' })
    const ref = useRef(null)
    const refClose = useRef(null)
    let navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            getNotes();
        } else {
            navigate('/login')
        }
        // eslint-disable-next-line
    }, [])

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }

    const handleclick = (e) => {
        editNote(note.id, note.title, note.description, note.tag)
        refClose.current.click()
        props.showAlert('success', 'Note updated successfully')
    }

    const updateNote = (currentNote) => {
        ref.current.click()
        setNote({ id: currentNote._id, title: currentNote.title, description: currentNote.description, tag: currentNote.tag })
    }

    return (
        <>
            <AddNote showAlert={props.showAlert} />
            <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" aria-describedby="emailHelp" name='title' onChange={onChange} value={note.title} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="description" name='description' onChange={onChange} value={note.description} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tag" className="form-label">Tag</label>
                                    <input type="text" className="form-control" id="tag" name='tag' onChange={onChange} value={note.tag} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note.title.length < 3 | note.description.length < 5} type="button" className="btn btn-primary" onClick={handleclick}>Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row my-3'>
                <h2>Your Notes</h2>
                <div className="conatiner mx-2">
                    {notes.length === 0 && 'No notes to display'}
                </div>
                {notes.map((note) => {
                    return <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert={props.showAlert} />
                })}
            </div >
        </>
    )
}

export default Notes
