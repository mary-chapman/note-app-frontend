import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNoteData: null,
            notes: []
        }

        this.makeActive = this.makeActive.bind(this);
    }

    componentDidMount() {
        var username = document.cookie.split("=")[1];
        
        axios.get('http://localhost:8080/users')
            // will later be the cookie of the current user
            .then(res => res.data.filter(i => i.userName === "user1"))
            //.then(res => console.log(res[0].titles))
            .then(user => user[0].titles.map(i =>{
                this.setState({
                    notes: [...this.state.notes, i]
                })
            }))
            // .then(() => console.log(this.state.notes))
    }

    async makeActive(e) {
        await this.setState({ activeNoteData: this.state.notes.filter(i => i.text == e.target.innerHTML)[0] })
        // await console.log("active data" + this.state.activeNoteData)

    }

    render() {
        
        return (
            <div>
                { this.state.activeNoteData === null ? 
                    <Notes handleClick={this.makeActive} notes={this.state.notes} name={this.state.notes}/> : 
                    <NoteDetail 
                        name={this.state.activeNoteData.text}
                        headers={this.state.activeNoteData.headers}
                        paras={this.state.activeNoteData.headers}
                    />
                }
            </div>
        );
    }
}

export default Main;