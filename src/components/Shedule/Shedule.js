import React from 'react'
import MatchList from './MatchList/MatchList'
import SelectionArea from './SelectionArea/SelectionArea'
import { req, League } from '../../model/Model'

class Shedule extends React.Component{

    constructor(props) {
        super(props);
        this.leagues = [];
        this.quantity = 10;
    }

    componentDidMount() {
        
        fetch(req.rapidApi.currentSeasonLeaguesURL, req.rapidApi.requestOptions)
            .then(response => response.json())
            .then(data => data.api.leagues)
            .then(dataCurrentLeagues => {
                req.footballData.leaguesKeys.forEach((key) => {
                    // console.log(key);
                    fetch(req.footballData.leaguesBaseURL + key + req.footballData.scheduledFilter, req.footballData.requestOptions)
                        .then(response => response.json())
                        .then(dataMatches => {
                            let league = new League(dataMatches.competition.name, dataMatches.competition.area.name);
                            league.matches = dataMatches.matches;

                            dataCurrentLeagues.forEach((l) => {
                                if(l.name == league.name && (l.country == league.country || l.country == ('World' || 'Europe'))) {
                                    league.logo = l.logo;
                                    
                                    fetch(req.rapidApi.leaguesBaseURL + l.league_id, req.rapidApi.requestOptions)
                                        .then(response => response.json())
                                        .then(data => data.api.teams)
                                        .then(logotypes => {
                                            league.logotypes = logotypes;
                                            this.leagues.push(league);
                                        })
                                }
                            });
                        });
                });
            });   
    }

    render() {
        return (
            <div>
                <MatchList  leagues={this.leagues} quantity={this.quantity} />
                <SelectionArea leagues={this.leagues} />
            </div>
        );
    };
}

export default Shedule;
