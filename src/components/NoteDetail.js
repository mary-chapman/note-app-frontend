import React, {Component} from 'react';
import axios from 'axios';

class NoteDetail extends Component {
    // constructor(props) {

    // }


    render() {
        return (
            <div>
                <h1>{this.props.name}</h1>
                {/* { (this.props.headers) ? console.log(this.props.headers[0].paras[0].text) : null } */}


                {/* { 
                    (this.props.headers) ? 
                        this.props.headers.map((i, index) => <h3 key={index}>{i.text}</h3>) : 
                        null 
                } */}

                {
                    (this.props.headers) ? 
                        this.props.headers.map((header) => {
                            return (
                                <div key={header.id}>
                                    <h3>{header.text}</h3> 
                                    { (header.paras.length > 0) ?
                                        header.paras.map(para => {
                                            return <p key={para.id}>{para.text}</p>
                                        }) 
                                        : null 
                                    }
                                </div>
                            )
                        }) : 
                        null  
                }


                
            </div>
        );
    }
}

export default NoteDetail;