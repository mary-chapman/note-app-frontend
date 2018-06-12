import React, {Component} from 'react';
import axios from 'axios';

import './NoteDetail.css'

class NoteDetail extends Component {
    render() {
        return (
            <div className="noteDetail">
                <h1>{this.props.name}</h1>
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
        );
    }
}

export default NoteDetail;