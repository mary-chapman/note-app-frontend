import React, {Component} from 'react';
import axios from 'axios';
import Textarea from "react-textarea-autosize";
import {Link, withRouter} from 'react-router-dom'

import './NoteDetail.css'

class NoteDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            noteDetail: '',
            titleId: this.props.location.state.foo,
            tempInput: '',
            tempParaInput: '',
            currHeader: null
        }

        this.headerRef = React.createRef();

    }
    componentWillMount() {
        axios.get(`http://localhost:8080/titles/${this.state.titleId}`)
        .then(res => res.data.headers.map(i => {
            this.setState({
                noteDetail: [...this.state.noteDetail, i]
            })
        }))
        .then(() => console.log(this.state.noteDetail))
    }
    editHeader = (data, index, e) => {
            var stateCopy = [...this.state.noteDetail]; // create copy of state
            stateCopy[index].text = e.target.value; //new value
            this.setState({ stateCopy}) // update the state with the new value  
    }
    editPara = (paraId, headerIndex, paraIndex, e) => {
            if (paraIndex) {
                var stateCopy = [...this.state.noteDetail]; // create copy of state
                stateCopy[headerIndex].paras[paraIndex].text = e.target.value; //new value
                this.setState({ stateCopy }, () => {console.log(this.state.noteDetail)}) // update the state with the new value
            } else {
                var stateCopy = [...this.state.noteDetail]; // create copy of state
                stateCopy[headerIndex].paras = [{text: e.target.value, id: this.state.noteDetail[headerIndex].paras[paraIndex].id}]
                this.setState({ stateCopy },() => {console.log(this.state.noteDetail)}) // update the state with the new value
            }
    }
    sendHeaderToDb = (headerIndex, id, e) => {
        var dataObj = { text: e.target.value }
        var jsonToSend = JSON.stringify(dataObj);
        axios.patch(`http://localhost:8080/headers/${id}`, jsonToSend, {
            headers: { 'Content-Type': 'application/json' },
        }) 
    }
    sendParasToDb = (headerIndex, id, e) => {
        if (id) {
            var dataObj = { text: e.target.value  }
            var jsonToSend = JSON.stringify(dataObj);
            axios.patch(`http://localhost:8080/paras/${id}`, jsonToSend, {
                headers: { 'Content-Type': 'application/json' },
            })
        } else {
            //console.log(this.state.noteDetail)
        } 

    }
    createNewHeader = (headerIndex, e, paraClassName) => {
        var className = paraClassName;
        var headerVal = () => e.target.value || 'test';
        var headerObj = {
            text: headerVal,
            title: { id: this.state.titleId}
        }
        var jsonObj = JSON.stringify(headerObj)
        axios.post(`http://localhost:8080/headers`, jsonObj, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => {
            var headerId = res.data.id;
            var paraObj = {
                text: '',
                header: { id: res.data.id }
            }
            var jsonPara = JSON.stringify(paraObj)
            axios.post(`http://localhost:8080/paras`, jsonPara, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                this.setState({
                    noteDetail: [{ id: headerId, text: headerVal, paras: [{id: res.data.id}, {text: ''}]  }]
                }, () => document.querySelectorAll('textarea')[0].focus()
                )  
            })
            .then(() => console.log(this.state.noteDetail))
        })
    }

    createNewHeader = (headerIndex, e, paraClassName) => {
        var className = paraClassName;
        var headerVal = e.target.value;
        var headerObj = {
            text: headerVal,
            title: { id: this.state.titleId}
        }
        var jsonObj = JSON.stringify(headerObj)
        axios.post(`http://localhost:8080/headers`, jsonObj, {
            headers: { 'Content-Type': 'application/json' },
        })
        // .then(res => this.setState({ currHeader: res.data.id }))
        .then(res => {
            var headerId = res.data.id;
            var paraObj = {
                text: '',
                header: { id: res.data.id }
            }
            var jsonPara = JSON.stringify(paraObj)
            axios.post(`http://localhost:8080/paras`, jsonPara, {
                headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
                this.setState({
                    noteDetail: [...this.state.noteDetail, { id: headerId, text: headerVal, paras: [{id: res.data.id}, {text: ''}]  }]
                }, () => document.querySelectorAll('input')[this.state.noteDetail.length - 1].focus()
                )  
            })
            .then(() => console.log(this.state.noteDetail))
            //.then(() => document.querySelectorAll('para')[this.state.noteDetail.length - 1].focus())
        })
    }
    handleKeyPress = (e) => {
        if (e.key == 'Enter') {
            if (e.target.nextSibling) { e.target.nextSibling.focus() }
        }
    }
    deleteNote = () => {
        axios.delete(`http://localhost:8080/titles/${this.state.titleId}`)
        .then(res => this.props.history.push('/notes'))

    }
    createPara(textToInsert, headerId, paraIndex = 0) {
        console.log("X")
        var dataObj = {
            text: textToInsert,
            header: { id: headerId }
        } 
        var jsonObj = JSON.stringify(dataObj);
        axios.post(`http://localhost:8080/paras`, jsonObj, {
            headers: { 'Content-Type': 'application/json' },
        })
        var stateCopy = [...this.state.noteDetail]; // create copy of state
        console.log(stateCopy[headerId].paras)
        if (stateCopy[headerId].paras.length > 0) {
            stateCopy[headerId].paras[paraIndex].text = textToInsert; //new value
        } else {
            stateCopy[headerId].paras = [{ text: textToInsert}];
        }
        this.setState({ stateCopy }, () => {
            console.log(document.getElementsByClassName("para")[paraIndex].focus())
            //document.getElementsByClassName("paras")[paraIndex - 1].focus();        
        }) // update the state with the new value

    }
    render() {
        return (
            <div className="noteDetail">
                <h1>note detail</h1>
                <button onClick={(e) => this.createNewHeader(this.state.noteDetail.length - 1, e, 'lastInput')}>add header</button>
                <button onClick={() => this.deleteNote()}>delete note</button>
                <button onClick={() => this.createPara('hello', 1)}>create para test</button>
                
                { (this.state.noteDetail) ?
                    this.state.noteDetail.sort((a, b) => a.orderIndex - b.orderIndex).map((data, headerIndex) => {
                    return ( 
                        <div key={data.id}>
                        
                            <input 
                                ref={this.headerRef}
                                onChange={(e) => this.editHeader(data.text, headerIndex, e)}
                                onBlur = {(e) => this.sendHeaderToDb(headerIndex,data.id, e)}
                                value= {this.state.noteDetail[headerIndex].text} 
                                onKeyPress={(e) => this.handleKeyPress(e)}
                                />

                            
                            { (data.paras) ? 
                                data.paras.map((para, paraIndex) => {
                                    return (
                                        <Textarea 
                                            onChange={(e) => this.editPara(para.id, headerIndex, paraIndex, e)}
                                            onBlur = {(e) => this.sendParasToDb(headerIndex, para.id, e)}
                                            key = {paraIndex}
                                            style={{ resize: "none" }}
                                            className="para"
                                            value={para.text}
                                        ></Textarea>
                                    )
                                }) : 
                                    <Textarea 
                                        onBlur = {(e) => this.createNewPara(headerIndex, data.id, e)}
                                        style={{ resize: "none" }}
                                        className="para"
                                    ></Textarea>
                                }

                            {/* { (data.codeblocks) ?
                                // CODEBLOCKS
                            } */}

                        </div> 
                )}) : 
                <input 
                    className="lastInput"
                    style={{backgroundColor: 'lightgreen'}}
                    onBlur = {(e) => {this.createNewHeader(this.state.titleId, e, "lastInput")} }
                    onKeyPress={(e) => this.handleKeyPress(e)}
                />
                }
            </div>
        )
    }
}

export default NoteDetail;