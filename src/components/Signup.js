import React, {Component} from 'react';

import axios from 'axios';

class Signup extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        // axios.get('http://localhost:8080/users')
        // .then(res => console.log(res));
        
        // post to db
        var objToSend = {
            userName: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        }
        var data = JSON.stringify(objToSend);
        axios.post('http://localhost:8080/users', data, {
             headers: {
                'Content-Type': 'application/json',
             }
        })
        // set cookie
        function setCookie(c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        }
        setCookie("cookie", document.getElementById("username").value, 3);        
    }


    render() {
        return (
            <div>
                <div>
                     
                    Username <input type="text" id="username" name="username" />
                    Email <input id="email" name="email" />
                    Password <input id="password" name="password" />

                    <button onClick={this.handleClick}>Sign Up</button>
                </div>
            </div>
        );
    }
}

export default Signup;