import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNoteData: null,
            notes: [],
        }
    }

    componentDidMount() {
        var username = document.cookie.split("=")[1];
        
        axios.get('http://localhost:8082/titles')
            //***** temporarily hardcoded - change later *****
            .then(res => res.data.filter(i => i.userId === 1))
            //.then(res => console.log(res[0]))
            .then(res => res.map(i =>{
                this.setState({
                     notes: [...this.state.notes, i]
                })
            }))
    }


    render() {
        
        return (
            <div className="readMode">
                {/* { console.log(this.state.notes)} */}
                <div>NOTES</div>
                { (this.state.notes) ? 
                    this.state.notes.map(title => {
                        
                        return (
                            <div>
                                <h1 key={title.id}>{title.text}</h1>
                                { ( title.headers.length > 0) ? 
                                    title.headers.map(header => {
                                        return (
                                            <div>
                                                <h3>{header.text}</h3>
                                                { ( header.paras.length > 0) ? 
                                                    header.paras.map(para => {
                                                        return <p>{para.text}</p>
                                                    }) : null
                                                }
                                            </div>
                                        )
                                    }) : null
                                }
                            </div>
                        )
                        
                    }) : <h1>loading</h1> 
                }

            </div>
        );
    }
}

export default Main;