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
            .then(() => console.log(this.state.notes))
    }
    goToInput = () => {
        document.getElementsByClassName("newNote")[0].focus();
    }
    handleInput = (e) => {
        this.setState({ input: e.target.value})
    }
    addNote = () => {        
    //    this.setState({ notes: [...this.state.notes, { text: 'text', id: 1}, console.log(() => this.state.notes)] })
        var objToSend = {
            text: document.getElementsByClassName("newNote")[0].value
        }
        var jsonToSend = JSON.stringify(objToSend)
        axios.post('http://localhost:8080/titles', jsonToSend,  {
            headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => {
            notes: [...this.state.notes, res.data]
        })
    }

    render() {
        return (
            <div className="notes">
                <button onClick={(e) => this.goToInput(e)} >
                    add note
                </button>
                <input 
                    onChange = {this.handleInput}

                    className="newNote" value={this.state.input} onBlur={this.addNote} />

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