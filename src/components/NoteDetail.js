import React, {Component} from 'react';
import axios from 'axios';

class NoteDetail extends Component {
    // constructor(props) {

    // }


    render() {
        return (
            <div>
                <h2>{this.props.name}</h2>

                { (this.props.headers) ? 
                    this.props.headers.map((i, index) => <div key={index}>{i.text}</div>) : 
                    null }
                   
                
            </div>
        );
    }
}

export default NoteDetail;