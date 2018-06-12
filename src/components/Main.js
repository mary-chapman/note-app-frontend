import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNote: null
        }

        this.makeActive = this.makeActive.bind(this);
    }

    makeActive(e) {
        this.setState({ activeNote: e.target.innerHTML})
    }

    render() {
        return (
            <div>
                { this.state.activeNote === null ? 
                    <Notes handleClick={this.makeActive}/> : 
                    <NoteDetail />
                }
            </div>
        );
    }
}

export default Main;