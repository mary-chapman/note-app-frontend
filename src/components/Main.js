import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

import './Main.css'

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNoteData: null,
            notes: [],
            readMode: true,
            editTitle: false

        }

        this.inputVal = React.createRef();
        
        this.addNote = this.addNote.bind(this);
        this.editTitle = this.editTitle.bind(this);
        this.editHeader = this.editHeader.bind(this);
        this.editPara = this.editPara.bind(this);

        this.sendEditedHeaderToDb = this.sendEditedHeaderToDb.bind(this);
        // this.test = this.test.bind(this);

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

    addNote() {
        console.log()
        var data = {
            userId: 1,
            text: document.getElementById("new").value
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

    // deleteTitle(title) {
    //     console.log(this.state.notes.text)
    //     this.setState({ notes: this.state.notes.filter(text => text.id != title.id) })
    // }

    editTitle(title, index, e) {
        var stateCopy = [...this.state.notes]; // create copy of state
        stateCopy[index].text = e.target.value; //new value
        this.setState({ stateCopy }) // update the state with the new value   
    }

    editHeader(header, currTitleIndex, currHeaderIndex, e) {
        var stateCopy = [...this.state.notes]; // create copy of state
        stateCopy[currTitleIndex].headers[currHeaderIndex].text = e.target.value; //new value
        this.setState({ stateCopy }) // update the state with the new value
    }

    editPara(para, currTitleIndex, currHeaderIndex, currParaIndex, e) {
        // console.log(this.state.notes[currTitleIndex].headers[currHeaderIndex].paras[currParaIndex])
    }

    sendEditedTitleToDb(title, e) {
        var data = { text: e.target.value}
        var objToSend = JSON.stringify(data);
        axios.patch(`http://localhost:8082/titles/${title}`, objToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    sendEditedHeaderToDb(headerId, e) {
        var data = { text: e.target.value}
        var objToSend = JSON.stringify(data);
        axios.patch(`http://localhost:8082/headers/${headerId}`, objToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    render() {
        return (
            <div className="main">
                { (this.state.notes) ? 
                    this.state.notes.map((title,titleIndex) => {
                        return (
                            <div key={titleIndex} >
                                <input 
                                    className="title"
                                    onChange={(e) => this.editTitle(title, titleIndex, e)}
                                    onBlur = {(e) => this.sendEditedTitleToDb(title.id, e)}
                                    value={title.text} 
                                />
                                { (title.headers) ? 
                                   title.headers.map((header,headerIndex) => {
                                        return (
                                            <div key={headerIndex}>
                                                <input
                                                    className="header"
                                                    onChange={(e) => this.editHeader(header, titleIndex, headerIndex, e)}
                                                    onBlur = {(e) => this.sendEditedHeaderToDb(header.id, e)}
                                                    value={header.text} />
                                                        { (header.paras) ? 
                                                            header.paras.map((para, paraIndex) => {
                                                                return (
                                                                    <div key={paraIndex} >
                                                                        <input 
                                                                            className="para"
                                                                            onChange={(e) => this.editPara(para, titleIndex, headerIndex, paraIndex, e)}
                                                                            // onBlur = {(e) => this.sendEditedParaToDb(title.id, e)}
                                                                            value={para.text} 
                                                                        />
                                                                    </div>
                                                                ) 
                                                            }) : null
                                                        }
                                                        
                                            </div>
                                        ) 
                                    }) : null 
                                }
                            </div>
                        )
                    }) : null
                        
                }
            </div>
        )
    }
}


export default Main;

