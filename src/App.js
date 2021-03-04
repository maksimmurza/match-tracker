import './App.css';
import React from 'react'
import token from './token.json'

class App extends React.Component{

  constructor(props) {
      super(props);
      this.baseURL = 'https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED';
      this.init = {
          headers: {
              'X-Auth-Token' : token
          }
      };
      console.log(this.init);
      this.state = {shedule:'Loading...'};
  }

  componentDidMount() {
      this.getShedule();
  }

  getShedule() {
      fetch(this.baseURL, this.init)
          .then(response => response.json())
          .then(data => {
              this.setState({
                  shedule: JSON.stringify(data)
              });
          });
  }

  render() {
      return (
          <p>{this.state.shedule}</p>
      );
  };
}

export default App;
