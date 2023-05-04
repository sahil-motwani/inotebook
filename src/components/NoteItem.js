import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const NoteItem = (props) => {

    const context = useContext(noteContext)
    const { deleteNote } = context

    return (
        <div className="col-md-4">
        <div className="card my-3" >
                <div className="card-body">
                    <h5 className="card-title">{props.note.title}</h5>
                    <p className="card-text">{props.note.description}</p>
                    <i className="fa-regular fa-pen-to-square mx-2"onClick={()=>{props.updateNote(props.note)}}></i>
                    <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(props.note._id); props.showAlert('success','Note deleted sucessfully'); }}></i>
                </div>
        </div>
        </div>
    )
}

export default NoteItem
