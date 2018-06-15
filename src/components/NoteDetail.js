import React, {Component} from 'react';
import axios from 'axios';
import Textarea from "react-textarea-autosize";

import './NoteDetail.css'

class NoteDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            noteDetail: '',
            titleId: this.props.location.state.foo
        }

    }
    componentWillMount() {
        axios.get(`http://localhost:8080/titles/${this.state.titleId}`)
        .then(res => res.data.headers.map(i => {
            this.setState({
                noteDetail: [...this.state.noteDetail, i]
            })
        }))
    }
    editHeader = (data, index, e) => {
            var stateCopy = [...this.state.noteDetail]; // create copy of state
            stateCopy[index].text = e.target.value; //new value
            stateCopy = stateCopy.sort((a, b) => a.id - b.id);

            this.setState({ stateCopy}, () => console.log(stateCopy)) // update the state with the new value  
    }
    editPara = (headerIndex, paraIndex, e) => {
            var stateCopy = [...this.state.noteDetail]; // create copy of state
            stateCopy[headerIndex].paras[paraIndex].text = e.target.value; //new value
            this.setState({ stateCopy }) // update the state with the new value
    }
    sendHeaderToDb = (id, e) => {
        var dataObj = { text: e.target.value }
        var jsonToSend = JSON.stringify(dataObj);

        axios.patch(`http://localhost:8080/headers/${id}`, jsonToSend, {
            headers: { 'Content-Type': 'application/json' },
        })
    }
    sendParasToDb = (id, e) => {
        if (id) {
            var dataObj = { text: e.target.value  }
            var jsonToSend = JSON.stringify(dataObj);
            axios.patch(`http://localhost:8080/paras/${id}`, jsonToSend, {
                headers: { 'Content-Type': 'application/json' },
            })
        }

    }
    createNewPara(paraIndex, headerIndex) {
        var dataObj = {
            text: '',
            orderIndex: () => (paraIndex) ? paraIndex + 1 : 0,
            header: { id: headerIndex + 1 }
        }
        var jsonToSend = JSON.stringify(dataObj)
        axios.post(`http://localhost:8080/paras/`, jsonToSend, {
            headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
        var stateCopy = [...this.state.noteDetail]; // create copy of state
        stateCopy[headerIndex].paras = [{ text: ''}];
        //stateCopy[headerIndex].paras[0].text = 'hOLA'; //new value
        this.setState({ stateCopy }) // update the state with the new value
        })


    }
    render() {
        return (
            <div className="noteDetail">
                <h1>note detail</h1>

                { (this.state.noteDetail) ?
                    this.state.noteDetail.sort((a, b) => a.orderIndex - b.orderIndex).map((data, headerIndex) => {
                    return ( 
                        <div key={data.id}>
                            <input 
                                onChange={(e) => this.editHeader(data.text, headerIndex, e)}
                                onBlur = {(e) => this.sendHeaderToDb(data.id, e)}
                                value= {data.text} />
                                {/* { console.log(data.paras.length) } */}

                            { (data.paras.length > 0) ? 
                                data.paras.map((para, paraIndex) => {
                                    return (
                                        <Textarea 
                                            onChange={(e) => this.editPara(headerIndex, paraIndex, e)}
                                            onBlur = {(e) => this.sendParasToDb(para.id, e)}
                                            key = {para.id}
                                            style={{ resize: "none" }}
                                            className="para"
                                            value={para.text}
                                        ></Textarea>
                                    )
                                    // {this.createNewPara(paraIndex+1, headerIndex)} 
                                    }) : null
                                 }
                            {/* { (data.codeblocks) ?
                            
                            } */}
                        </div> 
                )}) : null } 
            </div>
        )
    }
}

export default NoteDetail;