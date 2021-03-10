import React from 'react'
import MatchList from './MatchList/MatchList'
import SelectionArea from './SelectionArea/SelectionArea'
import './Schedule.css'
import { req, League } from '../../model/Model'

class Schedule extends React.Component{

    constructor(props) {
        super(props);
        this.state = {leagues: [], quantity: 10};
        this.arr = [];
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {

        let currentLeagues = await this.getCurrentLeagues();
            
        for(let key of req.footballData.leaguesKeys) {

            let live = await this.getSchedule(key, req.footballData.liveFilter);
            let schedule = await this.getSchedule(key, req.footballData.scheduledFilter);
            live.matches.forEach(liveMatch => {
                schedule.matches.push(liveMatch);
            });
            
            let league = new League(schedule.competition.name, schedule.competition.area.name);
            league.matches = schedule.matches;
            
            for(let l of currentLeagues) {
                
                if(l.name == league.name && (l.country == league.country || l.country == ('World' || 'Europe'))) {
                    
                    league.logo = l.logo;
                    
                    let teams = await this.getTeamsInfo(l.league_id);
                    league.teams = teams;

                    this.arr.push(league);
                    this.setState({leagues: this.arr});
                        
                }
            }  
        }
    }

    async getCurrentLeagues() {
        let source = req.rapidApi;
        const response = await fetch(source.currentSeasonLeaguesURL, source.requestOptions);
        const data = await response.json();
        return data.api.leagues;
    }

    async getSchedule(leagueKey, filter) {
        let source = req.footballData;
        const response = await fetch(source.leaguesBaseURL + leagueKey + filter, source.requestOptions);
        const data = await response.json();
        return data;
    }

    async getTeamsInfo(leagueId) {
        let source = req.rapidApi;
        const response = await fetch(source.leaguesBaseURL + leagueId, source.requestOptions);
        const data = await response.json();
        return data.api.teams;
    }

    render() {
        return (
            <div className='flex-container'>
                <MatchList  leagues={this.state.leagues} 
                            quantity={this.state.quantity} />
                <SelectionArea leagues={this.state.leagues} />
            </div>
        );
    };
}

export default Schedule;
