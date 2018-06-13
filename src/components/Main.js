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
            readMode: true,
            editTitle: false

        }

        this.inputVal = React.createRef();
        
        this.addNote = this.addNote.bind(this);
        this.editTitle = this.editTitle.bind(this);
        // this.test = this.test.bind(this);

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

    addNote() {
        console.log()
        var data = {
            userId: 1,
            text: document.getElementById("new").value
        }
        axios.post('http://localhost:8082/titles', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(req => this.setState({ 
            notes: [ ...this.state.notes, req.data ]
        }))
    }

    // deleteTitle(title) {
    //     console.log(this.state.notes.text)
    //     this.setState({ notes: this.state.notes.filter(text => text.id != title.id) })
    // }
    editTitle(title, index, e) {
        console.log(e.target.value)
        // // console.log(e.target.value)
        // //console.log(this.state.notes)

        var stateCopy = [...this.state.notes]; // create copy of state
        //console.log(stateCopy[index].text)
        stateCopy[index].text = e.target.value; //new value
        this.setState({ stateCopy }) // update the state with the new value
        
        // console.log(this.inputVal.current.value)
        
    }

    sendEditedTitleToDb(title, e) {
        console.log("on blur" + e.target.value)
        var data = { text: e.target.value}
        var objToSend = JSON.stringify(data);

        axios.patch(`http://localhost:8082/titles/${title}`, objToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }




    render() {
        return (
            <div className="main">
                { (this.state.notes) ? 
                    this.state.notes.map((title,index) => {
                        return (
                            <div key={index} >
                                {/* <input onChange={this.test(title)} /> */}
                                <input 
                                    onChange={(e) => this.editTitle(title, index, e)}
                                    onBlur = {(e) => this.sendEditedTitleToDb(title.id, e)}
                                    // onChange={() => this.editTitle(title, index)} 
                                    // ref={this.inputVal} 
                                    value={title.text} 
                                />
                            </div>
                        )
                    }) : null
                        
                }
            </div>
        )
    }
}


export default Main;

                {/* <div>NOTES</div>
                <button onClick={this.addNote}>add note</button>
                <input id="new" />

                { (this.state.notes) ? 
                    this.state.notes.map(title => {
                        return (
                            <div key={title.id} >
                                <h1 onClick={this.editMode} id="title">{title.text}</h1>
                                { ( title.headers) ? 
                                    title.headers.map(header => {
                                        return (
                                            <div key={header.id}>
                                                <h3>{header.text}</h3>
                                                { ( header.paras.length > 0) ? 
                                                    header.paras.map(para => {
                                                        return <p key={para.id}>{para.text}</p>
                                                    }) : null
                                                }
                                            </div>
                                        )
                                    }) : null
                                }
                            </div>
                        )
                        
                    }) : <h1>loading</h1> 
                } */}


