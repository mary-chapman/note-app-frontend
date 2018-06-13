import React, {Component} from 'react';
import axios from 'axios';

import './NoteDetail.css'

class NoteDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            readMode: true
        }

        this.readMode = this.readMode.bind(this);
        this.writeMode = this.writeMode.bind(this);
        this.addHeader = this.addHeader.bind(this);
        // this.handleParaEdit = this.handleParaEdit.bind(this);


    }
    addHeader() {
        console.log("ADD")
        return <textbox />
    }

    readMode() {
        return (
            <div className="readMode">
                { (this.props.headers) ? 
                        this.props.headers.map((header) => {
                            return (
                                <div key={header.id}>
                                    <h3>{header.text}</h3> 
                                    { (header.paras.length > 0) ?
                                        header.paras.map(para => {
                                            return <p key={para.id}>{para.text}</p>
                                        }) : null }
                                    { (header.codeblocks.length > 0) ?
                                        header.codeblocks.map(codeblock => {
                                            return <p className="code" key={codeblock.id}>{codeblock.text}</p>
                                        }) : null }
                                </div>
                            )
                        }) : null }
            </div>
        )
    }
    writeMode() {
        return (
            <div className="readMode">
                { (this.props.headers) ? 
                        this.props.headers.map((header) => {
                            return (
                                <div key={header.id}>
                                    <input value={header.text} />
                                    { (header.paras.length > 0) ?
                                        header.paras.map(para => {
                                            return <input key={para.id} value={para.text}  />
                                        }) : null }
                                    { (header.codeblocks.length > 0) ?
                                        header.codeblocks.map(codeblock => {
                                            return <input className="code" key={codeblock.id} value={codeblock.text} />
                                        }) : null }
                                </div>
                            )
                        }) : null }
            </div>
        )
    }
    render() {
        return (
            <div className="noteDetail">
                <button onClick={() => this.setState({ readMode: false })}>edit</button>
                <button onClick={() => this.setState({ readMode: true })}>save</button>
                <br />
                <button onClick={this.addHeader}>ADD HEADER</button>
                <button>ADD PARA</button>
                <button>ADD CODE</button>

                { (this.state.readMode) ? 
                    this.readMode() : this.writeMode()
                }
                
            </div>
        );
    }
}

export default NoteDetail;