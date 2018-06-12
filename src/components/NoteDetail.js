import React, {Component} from 'react';
import axios from 'axios';

import './NoteDetail.css'

class NoteDetail extends Component {
    constructor(props) {
        super(props);

        this.readMode = this.readMode.bind(this);
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
    render() {
        return (
            <div className="noteDetail">
                {this.readMode()}
            </div>
        );
    }
}

export default NoteDetail;