import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

import './Notes.css';

class Notes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: []
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

    render() {
        return (
            <div className="notes">
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