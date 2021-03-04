import './App.css';
import React from 'react'
import tokenForShedule from './token-football-data.json'
import tokenForLogo from './token-rapid-api.json'
import Container from './Container/Container'

class App extends React.Component{

    constructor(props) {
        super(props);
        this.sheduleURL = 'https://api.football-data.org/v2/competitions/PL/matches?status=SCHEDULED';
        this.logotypesURL = 'https://api-football-v1.p.rapidapi.com/v2/teams/league/2790';

        this.sheduleReqOptions = {
            headers: {
                'X-Auth-Token' : tokenForShedule
            }
        };

        this.logotypesReqOptions = {
            headers: {
                "x-rapidapi-key": tokenForLogo,
	            "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
	            "useQueryString": true
            }
        };
        
        this.state = {shedule:'Loading...'};
    }

    componentDidMount() {
        this.getShedule();
        this.getLogotypes();
    }

    getShedule() {
        fetch(this.sheduleURL, this.sheduleReqOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    shedule: data
                });
            });   
    }

    getLogotypes() {
        fetch(this.logotypesURL, this.logotypesReqOptions)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    logotypes: data.api.teams
                });
            });
    }

    render() {
        return (
            <Container  shedule={this.state.shedule.matches} 
                        logotypes={this.state.logotypes} />
        );
    };
}

export default App;
