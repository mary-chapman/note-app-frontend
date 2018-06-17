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
            .then(res => res.data.map(i => this.setState({ notes: [...this.state.notes, i] }) ))
            .then(() => console.log(this.state.notes))
    }

    render() {
        return (
            <div className="notes">
                <h1>notes</h1>
                {this.state.notes.map(i => {
                    var name= "test"
                    return (
                        <div key={i.id}>
                        <Link to={`/note/${i.id}`} ><button>{i.text}</button></Link>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default Notes;