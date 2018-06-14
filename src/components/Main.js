import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

import Textarea from "react-textarea-autosize";

import './Main.css'

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNoteData: null,
            notes: [],
            readMode: true,
            editTitle: false,
            currentCursorLocation: 0
        }

        this.inputVal = React.createRef();
        this.editTitle = this.editTitle.bind(this);
        this.editHeader = this.editHeader.bind(this);
        this.editPara = this.editPara.bind(this);
        this.getcurrentCursorLocation = this.getcurrentCursorLocation.bind(this);
        this.sendEditedHeaderToDb = this.sendEditedHeaderToDb.bind(this);

    }

    componentDidMount() {
        var username = document.cookie.split("=")[1];
        
        axios.get('http://localhost:8082/titles')
            //***** temporarily hardcoded - change later *****
            .then(res => res.data.filter(i => i.userId === 1))
            .then(res => res.map(i =>{
                this.setState({
                     notes: [...this.state.notes, i]
                })
            }))
    }
    getcurrentCursorLocation(titleIndex, headerIndex, paraIndex) {
        console.log(titleIndex + " "  + headerIndex + " " + paraIndex)
    }
    // edit elements
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
        console.log(this.state.notes[currTitleIndex].headers[currHeaderIndex].paras[currParaIndex])
        var stateCopy = [...this.state.notes]; // create copy of state
        stateCopy[currTitleIndex].headers[currHeaderIndex].paras[currParaIndex].text = e.target.value;
        this.setState({ stateCopy });
    }

    sendEditedTitleToDb(title, e) {

        if (title) {
            var data = { 
                text: e.target.value
            }
            var objToSend = JSON.stringify(data);
            axios.patch(`http://localhost:8082/titles/${title}`, objToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

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
    sendEditedParaToDb(paraId, e) {
        var data = { text: e.target.value}
        var objToSend = JSON.stringify(data);
        axios.patch(`http://localhost:8082/paras/${paraId}`, objToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    sendEditedParaToDb(paraId, e) {
        if (e.target.value) {
            var data = { text: e.target.value}
            var objToSend = JSON.stringify(data);
            axios.patch(`http://localhost:8082/paras/${paraId}`, objToSend, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
    }

    // CREATE elements
    createNewPara(headerId, e) {

        var data = { 
            text: e.target.value,
            header: { id: headerId }
        }
        var objToSend = JSON.stringify(data);
        axios.post(`http://localhost:8082/paras/`, objToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }



    createNewTitle() {
        var newTitleElem;
        var newTitleId;
        
        var data = { 
            text: '',
            userId: 1
        }
        var objToSend = JSON.stringify(data);
        axios.post(`http://localhost:8082/titles/`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(res => newTitleId = res.data.id)
        .then(res => {
            this.setState({
                 notes: [...this.state.notes, data]
            })
        })
        .then(() => {
            newTitleElem = document.getElementsByClassName("title")[document.getElementsByClassName("title").length -1]
            newTitleElem.focus()
        })
        .then(() => {
            newTitleElem.onblur = ((e) => this.sendEditedTitleToDb(newTitleId, e))
        })
        

        
    }


        // var data = { text: e.target.value}
        // var objToSend = JSON.stringify(data);



    // createNewHeader() { 
    //     var lastTitle = document.getElementsByClassName("title")[document.getElementsByClassName("title").length-1]
    //     console.log(document.getElementsByClassName("title"))
    // }

    render() {
        return (
            <div className="main">
                <div className="headerDisplay">
                    <h1>notes</h1>
                </div>

                <div className="bodyDisplay">
                <button onClick={this.createNewTitle.bind(this)} className="addNoteBtn">add note</button>
                {/* <button onClick={this.createNewHeader.bind(this)} className="addTitleBtn">add header</button> */}
                { (this.state.notes) ? 
                    this.state.notes.map((title,titleIndex) => {
                        
                        return (
                            <div key={titleIndex} >
                                <input 
                                    onFocus={() => this.getcurrentCursorLocation}
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
                                                                        <Textarea 
                                                                            onFocus={() => this.getcurrentCursorLocation(para.orderIndex,header.orderIndex,title.orderIndex )}
                                                                            style={{ resize: "none" }}
                                                                            className="para"
                                                                            onChange={(e) => this.editPara(para, titleIndex, headerIndex, paraIndex, e)}
                                                                            onBlur = {(e) => this.sendEditedParaToDb(para.id, e)}
                                                                            value={para.text} 
                                                                        />
                                                                    </div> ) 
                                                            
                                                        }) : null }

                                                         { (header.codeblocks) ? 
                                                            header.codeblocks.map((codeblock, codeblockIndex) => {
                                                                return (
                                                                    <div key={codeblockIndex} >
                                                                        <Textarea 
                                                                            // onFocus={() => this.getcurrentCursorLocation(para.orderIndex,header.orderIndex,title.orderIndex )}
                                                                            style={{ resize: "none" }}
                                                                            className="codeblock"
                                                                            // onChange={(e) => this.editPara(para, titleIndex, headerIndex, paraIndex, e)}
                                                                            // onBlur = {(e) => this.sendEditedParaToDb(para.id, e)}
                                                                            value={codeblock.text} 
                                                                        />
                                                                    </div> ) 
                                                            
                                                        }) : null }
                                                        
                                            </div> )
                                         
                                    }) : null }
                                
                            </div> )
                        
                    }) : null  }
                        
               
            </div>
        </div>
        )
    }
}



export default Main;




