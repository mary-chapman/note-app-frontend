import React, {Component} from 'react';
import axios from 'axios';

import Notes from './Notes'; 
import NoteDetail from './NoteDetail';

class Main extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeNote: null,
            notes: []
        }

        this.makeActive = this.makeActive.bind(this);
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

    makeActive(e) {
        this.setState({ activeNote: e.target.innerHTML})
    }

    render() {
        return (
            <div>
                { this.state.activeNote === null ? 
                    <Notes handleClick={this.makeActive} notes={this.state.notes}/> : 

                    <NoteDetail />
                }
            </div>
        );
    }
}

export default Main;