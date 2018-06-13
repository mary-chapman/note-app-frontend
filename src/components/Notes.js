import React, {Component} from 'react';
import axios from 'axios';

import './Notes.css';

class Notes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="notes">
                <h1>notes</h1>
                {/* { console.log(this.props.notes.length) } */}
                { (this.props.notes.length === 0) ? <p>loading</p> : 
                    this.props.notes.map((i, index) => <div onClick={this.props.handleClick} key={index}>{i.text}</div>)
                }
            </div>
        );
    }
}

export default Notes;