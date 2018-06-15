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
    editPara = (headerIndex, paraIndex, e) => {
            if (paraIndex) {
                var stateCopy = [...this.state.noteDetail]; // create copy of state
                stateCopy[headerIndex].paras[paraIndex].text = e.target.value; //new value
                this.setState({ stateCopy }) // update the state with the new value
            } else {
                var stateCopy = [...this.state.noteDetail]; // create copy of state
                stateCopy[headerIndex].paras = [{text: e.target.value}]
                this.setState({ stateCopy }) // update the state with the new value
            }

    }
    sendHeaderToDb = (id, e) => {
        var dataObj = { text: e.target.value }
        var jsonToSend = JSON.stringify(dataObj);

        axios.patch(`http://localhost:8080/headers/${id}`, jsonToSend, {
            headers: { 'Content-Type': 'application/json' },
        }) 
    }
    sendParasToDb = (state, id, e) => {
        console.log("sending")
        console.log(id)
        if (id) {
            var dataObj = { text: e.target.value  }
            var jsonToSend = JSON.stringify(dataObj);

            axios.patch(`http://localhost:8080/paras/${id}`, jsonToSend, {
                headers: { 'Content-Type': 'application/json' },
            })
        } 
    }
    createNewHeader = (headerIndex, e, paraClassName) => {
        //console.log(id)
        //console.log(e.target.value)
        var className = paraClassName;
        var headerVal = e.target.value;
        var headerObj = {
            text: e.target.value,
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
                text: 'x',
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

    createNewPara = (headerIndex, headerId, e) => {
        var paraId;
        var inputVal = e.target.value
        var paraObj = {

            text: e.target.value,
            header: { id: headerId}
        }

        
        var jsonPara = JSON.stringify(paraObj)
        axios.post(`http://localhost:8080/paras`, jsonPara, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
            axios.get(`http://localhost:8080/paras`).then(res => {
                console.log(res.data[res.data.length - 1].id)
                paraId = res.data[res.data.length - 1].id
            })
        })

        .then((res) => {
            console.log(res)
            var stateCopy = [...this.state.noteDetail]; // create copy of state
            stateCopy[headerIndex].paras = [{text: inputVal, id: paraId}]
            this.setState({ stateCopy }) // update the state with the new value
        })
        //.then(() => console.log(this.state.noteDetail)[0].paras.id) 
    }
    render() {
        return (
            <div className="noteDetail">
                <h1>note detail</h1>

                {/* {console.log(this.state.noteDetail)} */}

                { (this.state.noteDetail) ?
                    this.state.noteDetail.sort((a, b) => a.orderIndex - b.orderIndex).map((data, headerIndex) => {
                    return ( 
                        <div key={data.id}>
                            <input 
                                onChange={(e) => this.editHeader(data.text, headerIndex, e)}
                                onBlur = {(e) => this.sendHeaderToDb(data.id, e)}
                                value= {data.text} />

                            
                            { (data.paras.length > 0) ? 
                                data.paras.map((para, paraIndex) => {
                                    return (
                                        <Textarea 
                                            onChange={(e) => this.editPara(headerIndex, paraIndex, e)}
                                            onBlur = {(e) => this.sendParasToDb(this.state.noteDetail[headerIndex].paras, para.id, e, data.paras)}
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
                    onChange={(e) => this.handleChange(e)}
                    // onChange={(e) => this.editHeader(data.text, headerIndex, e)}
                    onBlur = {(e) => {this.createNewHeader(this.state.titleId, e, "lastInput")} }
                    //value={this.state.tempInput} 
                />
                }
            </div>
        )
    }
}

export default NoteDetail;