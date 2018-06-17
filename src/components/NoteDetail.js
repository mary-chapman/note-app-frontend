import React, {Component} from 'react';
import axios from 'axios';
import Textarea from "react-textarea-autosize";
import {Link, withRouter} from 'react-router-dom'

import './NoteDetail.css'

class NoteDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            noteDetail: []
        }


    }

    componentDidMount() {
        const { id } = this.props.match.params
        console.log(id)
        axios.get(`http://localhost:8080/titles/${id}`)
        .then(res => this.setState({ noteDetail: res.data.headers }))
        .then(() => console.log(this.state.noteDetail))
    }



    render() {
        return (
            <div className="noteDetail">
                note detail
                { (this.state.noteDetail) ?
                    this.state.noteDetail.map(header => {
                        return (
                            <h2 key={header.id}>{header.text}
                            { (header.paras) ? 
                                header.paras.map(i => {
                                    return <p>{i.text}</p>
                                }) : null }
                            </h2>
                        )

                }) : null }
            </div>
        )
    }
}

export default NoteDetail;

