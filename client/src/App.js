import React, {Component} from 'react';
import './App.css';

import Modal from './Modal/Modal';

const SERVER_BASE_URL   =   `http://localhost:8000`;

class App extends Component {
    constructor() {
        super();
        this.state = {
            modalActive: false,
            messages: []
        }
    }

    submitMessage() {
        const {email, text} = this.state;
        fetch(`${SERVER_BASE_URL}/message`, {
            method: 'POST',
            body: JSON.stringify({email, text}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if(data.code === 200) {
                    this.getMessages();
                }
            })
    }

    getMessages() {
        fetch(`${SERVER_BASE_URL}/messages`)
            .then(res => res.json())
            .then(messages => {
                this.setState({messages})
            })
    }

    showLastActivity(email) {
        const lastActivity    =   Math.max(...this.state.messages.filter(message => message.email === email).map(message => message.submitted));
        this.setState({modalActive: true, lastActivity})
    }

    componentDidMount() {
        this.getMessages();
    }

    render() {
        const {messages, filterMessageText, modalActive, lastActivity} = this.state;

        const filteredMessages = filterMessageText ? messages.filter(message => message.email.includes(filterMessageText)) : messages;
        return (
            <div className="App">
                <header>
                    <input type="text" placeholder="eMail" onKeyUp={e => this.setState({email: e.target.value})}/><br/>
                    <textarea placeholder="Message" onKeyUp={e => this.setState({text: e.target.value})}/><br/>
                    <div id="button-wrapper">
                        <button onClick={this.submitMessage.bind(this)}>Submit</button>
                    </div>
                </header>
                <main>
                    <input type="text" placeholder="eMail"
                           onKeyUp={e => this.setState({filterMessageText: e.target.value})}/><br/>
                    {filteredMessages.map((message, key) =>
                        <div key={key} className="message-wrapper">
                            <img onClick={this.showLastActivity.bind(this, message.email)} width="50px" height="50px" className="message-gravatar" src={`https://www.gravatar.com/avatar/${message.gHash}`}></img>
                            <div>
                                <div className="message-email">{message.email}</div>
                                <div className="message-text">{message.text}</div>
                            </div>
                        </div>
                    )}

                </main>
                <Modal modalActive={modalActive} lastActivity={lastActivity} />
            </div>

        );
    }
}

export default App;
