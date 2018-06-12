import React, {Component} from 'react';
import axios from 'axios';

class NoteDetail extends Component {
    render() {
        return (
            <div>
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
                                </div>
                            )
                        }) : null }


                
            </div>
        );
    }
}

export default NoteDetail;