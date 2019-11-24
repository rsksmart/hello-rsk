import React, { Component } from 'react';
import Web3 from 'web3';
import helloRSKAbi from './HelloRSKAbi';
import logo from './logo.svg';
import './App.css';

const node = 'https://public-node.testnet.rsk.co';

// https://explorer.testnet.rsk.co/address/0x0fb49bb37ba4b0186a87c866a2bbd29e1ef378da
const helloRSKAddress = '0x0fb49bb37ba4b0186a87c866a2bbd29e1ef378da';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      getting: false,
      greeting: null,
      value: '',
      setting: false,
    };

    this.getGreeting = this.getGreeting.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.setGreeting = this.setGreeting.bind(this);
  }

  componentDidMount () {
    this.getGreeting();
  }

  getGreeting () {
    this.setState({ getting: true });
    const web3 = new Web3(node);
    const helloRSK = new web3.eth.Contract(helloRSKAbi, helloRSKAddress);

    helloRSK.methods.getGreeting().call()
    .then(greeting => {
      this.setState({ greeting, getting: false })
    });
  }

  handleChange (event) {
    const { value } = event.target;
    this.setState({ value });
  }

  setGreeting (event) {
    event.preventDefault();
    this.setState({ setting: true });

    const { value } = this.state;

    const web3 = new Web3(window.web3);
    const helloRSK = new web3.eth.Contract(helloRSKAbi, helloRSKAddress);

    window.web3.currentProvider.enable()
    .then(accounts => helloRSK.methods.setGreeting(value).send({ from: accounts[0] }))
    .then(console.log)
    .catch(console.error);

    this.setState({ setting: false });
  }

  render () {
    const {
      greeting,
      getting,
      value,
      setting
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Welcome to the Internet of Value!
          </p>
        </header>
        <hr />
        <main className="App-body">
          <h1>Hello RSK!</h1>
          <p>Using a smart contract.</p>
          <div>
            <p>Greeting: <b>{getting ? '...' : greeting}</b></p>
          </div>
          <form onSubmit={this.setGreeting}>
            <input
              type="text"
              className="Greeting-input"
              value={value}
              onChange={this.handleChange}
              disabled={setting}
            />
            {
              !window.web3 ?
              <a href="https://chrome.google.com/webstore/detail/nifty-wallet/jbdaocneiiinmjbjlgalhcelgbejmnid" target="_blank" rel="noopener noreferrer">Get Nifty!</a> :
              <input type="submit" value="setGreeting()" className="Greeting-submit" disabled={!window.web3 || setting} />
            }
          </form>
        </main>
        <footer className="App-footer">
          Find the smart contract <a href="https://explorer.testnet.rsk.co/address/0x0fb49bb37ba4b0186a87c866a2bbd29e1ef378da" target="_blank" rel="noopener noreferrer">here</a>
        </footer>
      </div>
    );
  }
}

export default App;
