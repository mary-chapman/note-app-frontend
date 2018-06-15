import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import './Notes.css';

class Notes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: [],
            input: ''
        }
    }

    componentWillMount() {
        axios.get('http://localhost:8080/titles')
            //***** temporarily hardcoded - change later *****
            // .then(res => res.data.filter(i => i.userId === 1))
             //.then(res => console.log(res))
            .then(res => res.data.map(i =>{
                this.setState({
                     notes: [...this.state.notes, i]
                })
            }))
            // .then(() => console.log(this.state.notes))
    }
    addNote = () => {        
        var objToSend = {
            text: document.getElementsByClassName("newNote")[0].value
        }
        var jsonToSend = JSON.stringify(objToSend)
        axios.post('http://localhost:8080/titles', jsonToSend,  {
            headers: { 'Content-Type': 'application/json' },
        })
        // .then(res => console.log(res))
        // .then(() => {
        //     console.log(this.state.notes)
        // })
        .then((res) => this.setState({ notes: [...this.state.notes, res.data] }))
    }

    render() {
        return (
            <div className="notes">
                <button onClick={(e) => document.getElementsByClassName("newNote")[0].focus()} >
                    add note
                </button>
                <div>
                    <input 
                        onChange = { (e) => this.setState({ input: e.target.value}) }
                        className="newNote" 
                        value={this.state.input} 
                        // onBlur={this.addNote} 
                    />
                    <button onClick={this.addNote}>create</button>
                </div>

                {this.state.notes.map((note, index) => {
                    return (
                        <div key={index}>
                            <Link to={{ pathname: '/NoteDetail', state: { foo: note.id } }}><div>{note.text}</div></Link>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Notes;