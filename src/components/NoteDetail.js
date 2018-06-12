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
                        this.props.headers.map((i, index) => {
                            return (
                                <div key={index}>
                                    <h3>{i.text}</h3> 
                                    { (i.paras.length > 0) ? console.log(i.paras[0]) : null }
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