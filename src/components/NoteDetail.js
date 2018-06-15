import React, {Component} from 'react';
import axios from 'axios';
import Textarea from "react-textarea-autosize";

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
            //stateCopy = stateCopy.sort((a, b) => a.id - b.id);

            this.setState({ stateCopy}) // update the state with the new value  
    }
    editPara = (paraId, headerIndex, paraIndex, e) => {
            console.log("id " + paraIndex)
            //console.log(this.state.noteDetail[headerIndex].paras[paraIndex].id)
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
        console.log(id)
        //console.log(this.state.noteDetail[headerIndex].paras)
        var dataObj = { text: e.target.value }
        var jsonToSend = JSON.stringify(dataObj);

        axios.patch(`http://localhost:8080/headers/${id}`, jsonToSend, {
            headers: { 'Content-Type': 'application/json' },
        }) 
    }
    sendParasToDb = (headerIndex, id, e) => {
        console.log("sending")
        console.log(this.state.noteDetail)
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
        //console.log(id)
        //console.log(e.target.value)
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

            console.log(e.target.nextSibling.focus())
        }
    }
    render() {
        return (
            <div className="noteDetail">
                <h1>note detail</h1>
                <button onClick={(e) => this.createNewHeader(this.state.noteDetail.length - 1, e, 'lastInput')}>add header</button>

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
                    // value=''
                />
                }
            </div>
        )
    }
}

export default NoteDetail;