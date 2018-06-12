import React, {Component} from 'react';
import axios from 'axios';

class Notes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notes: []
        }
    }

    componentDidMount() {
        var username = document.cookie.split("=")[1];
        
        axios.get('http://localhost:8080/users')
            // will later be the cookie of the current user
            .then(res => res.data.filter(i => i.userName === "user1"))
            //.then(res => console.log(res[0].titles))
            .then(user => user[0].titles.map(i =>{
                this.setState({
                    notes: [...this.state.notes, i]
                })
            }))
            .then(() => console.log(this.state.notes))
    }

    render() {
        return (
            <div>
                <h1>notes</h1>
                <button>new note</button> 
                { console.log(this.state.notes.length) }
                { (this.state.notes.length === 0) ? <p>loading</p> : 
                    this.state.notes.map((i, index) => <div onClick={this.props.handleClick} key={index}>{i.text}</div>)
                }
            </div>
        );
    }
}

export default Notes;