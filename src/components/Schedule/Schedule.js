import React from 'react'
import MatchList from './MatchList/MatchList'
import SelectionArea from './SelectionArea/SelectionArea'
import './Schedule.css'
import { req, League } from '../../model/Model'
import stringSimilarity from 'string-similarity'

class Schedule extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            leagues: [], 
            quantity: 15, 
            onChangeLeague: this.onChangeLeague,
            onChangeTeam: this.onChangeTeam};
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
                
                if(l.name === league.name && (l.country === league.country || l.country === ('World' || 'Europe'))) {
                    
                    league.logo = l.logo;
                    
                    let teams = await this.getTeamsInfo(l.league_id);
                    teams.forEach(team => {team.show = true; team.leagueName = schedule.competition.name});
                    league.teams = teams;
                    console.log(teams.length);
                    league.teamsShowed = teams.length;

                    let s;

                    league.matches.forEach(match => {
                        
                        let arr = [];
                        league.teams.forEach(team => {
                            arr.push(team.name);
                            if(match.homeTeam.name.includes(team.name.slice(0,-2))) {
                                match.homeTeam = team;
                            }
                            if(match.awayTeam.name.includes(team.name.slice(0,-2))) {
                                match.awayTeam = team;
                            }
                        });
                        
                        if(match.homeTeam.logo === undefined) {
                            match.homeTeam = league.teams[stringSimilarity.findBestMatch(match.homeTeam.name, arr).bestMatchIndex];
                        }
                        
                        if(match.awayTeam.logo === undefined) {
                            match.awayTeam = league.teams[stringSimilarity.findBestMatch(match.awayTeam.name, arr).bestMatchIndex];
                        }
                    });

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

    onChangeLeague = (league) => {
        this.setState(state => {
            let leagues = state.leagues.map(value => { 
                return value.name === league.name ? league : value
            });
            return {...leagues};
        });
    }

    onChangeTeam = (team, status) => {
        console.log(team, status);
        let obj = this.state.leagues;
        
        obj.forEach(league => {
            if(league.name === team.leagueName) {
                league.teams.forEach(t => {
                    if(t.name === team.name) {

                        if(status === 'unchecked') {
                            t.show = false;
                            league.teamsShowed--;
                            if(league.status !== 'indeterminate') {
                                league.status = 'indeterminate';
                            } else if(league.teamsShowed == 0) {
                                league.status = 'unchecked'
                            }
                        } else {
                            if(league.teamsShowed == league.teams.length - 1) {
                                league.status = 'checked';
                            } else if(league.teamsShowed == 0) {
                                league.status = 'indeterminate';
                            }
                            t.show = true;
                            league.teamsShowed++;
                        }
                        
                    }  
                });
            }
        });

        this.setState({leagues: obj});
    }

    render() {
        return (
            <div className='flex-container'>
                <MatchList  leagues={this.state.leagues} 
                            quantity={this.state.quantity}
                            todayDate={new Date()} />
                <SelectionArea leagues={this.state.leagues}
                                onChangeLeague={this.onChangeLeague}
                                onChangeTeam={this.onChangeTeam} />
            </div>
        );
    };
}

export default Schedule;
