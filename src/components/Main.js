import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNoteData: null,
            notes: [],
        }

        this.makeActive = this.makeActive.bind(this);
        this.goBack = this.goBack.bind(this);
        this.addNote = this.addNote.bind(this);
    }

    componentDidMount() {
        var username = document.cookie.split("=")[1];
        
        axios.get('http://localhost:8082/titles')
            //***** temporarily hardcoded - change later *****
            .then(res => res.data.filter(i => i.userId === 1))
            //.then(res => console.log(res[0]))
            .then(res => res.map(i =>{
                this.setState({
                     notes: [...this.state.notes, i]
                })
            }))
    }

    async makeActive(e) {
        await this.setState({ activeNoteData: this.state.notes.filter(i => i.text == e.target.innerHTML)[0] })
        // await console.log("active data" + this.state.activeNoteData)
    }

    goBack() {
        this.setState({activeNoteData: null})
    }
    addNote() {
        console.log()
        var data = {
            userId: 1,
            text: document.getElementById("newNote").value
        }
        axios.post('http://localhost:8082/titles', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(req => this.setState({ 
            notes: [ ...this.state.notes, req.data ]
        }))
    }

    editPara(e) {
        console.log(this.state.activeNoteData)
    //     this.setState({
    //         notes: [...this.state.notes, e.target.value]
    //    })
    }

    render() {
        
        return (
            <div>
                <button onClick={this.goBack}>back</button>
                <button onClick={this.addNote}>new note</button> 
                <input id="newNote" />

                { console.log(this.state.notes) }
                { this.state.activeNoteData === null ? 
                    <Notes 
                        notes={this.state.notes} 
                        handleClick={this.makeActive} /> :
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