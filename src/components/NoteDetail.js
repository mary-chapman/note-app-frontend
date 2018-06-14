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
        axios.get(`http://localhost:8082/titles/${this.state.titleId}`)
        .then(res => res.data.headers.map(i => {
            this.setState({
                noteDetail: [...this.state.noteDetail, i]
            })
        }))
        .then(() => console.log(this.state.noteDetail))
    }
    editHeader = (data, e) => {
            // update state
            var noteId = this.state.noteDetail.findIndex(i => i.text === data) // find the index of the header in the state
            var stateCopy = [...this.state.noteDetail]; // create copy of state
            stateCopy[noteId].text = e.target.value; //new value
            this.setState({ stateCopy }, console.log(this.state.noteDetail)) // update the state with the new value   
    }

    sendHeaderToDb = (id, e) => {
        var dataObj = { 
            text: e.target.value
        }
        var jsonToSend = JSON.stringify(dataObj);
        axios.patch(`http://localhost:8082/headers/${id}`, jsonToSend, {
            headers: { 'Content-Type': 'application/json' },
        })
    }
    render() {
        return (
            <div className="noteDetail">
                <h1>note detail</h1>
                { (this.state.noteDetail) ?
                    this.state.noteDetail.map(data => {


                    return ( 
                        <div key={data.id}>
                            <input 
                                onChange={(e) => this.editHeader(data.text, e)}
                                onBlur = {(e) => this.sendHeaderToDb(data.id, e)}
                                value= {data.text} 
                            />
                            { (data.paras) ? 
                                data.paras.map(para => {


                                    return (
                                        <Textarea 
                                            key = {para.id}
                                            style={{ resize: "none" }}
                                            className="para"
                                            value={para.text}
                                        >
                                        </Textarea>
                                    )
                            }) : null }


                            {/* { (data.codeblocks) ?
                            
                            } */}
                        </div> 
                )}) : null } 
            </div>
        )
    }
}

export default NoteDetail;