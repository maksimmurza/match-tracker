import React from 'react'
import MatchList from './MatchList/MatchList'
import SelectionArea from './SelectionArea/SelectionArea'
import './Schedule.css'
import League from '../../model/League'
import req from '../../utils/requestOptions'
import stringSimilarity from 'string-similarity'
import {LocaleContext} from "./LocaleContext";
import {getSchedule, getCurrentLeagues, getTeamsInfo} from '../../utils/fetch'
import {getLocalLeagues, writeLocalLeagues} from '../../utils/local'

class Schedule extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            leagues: [], 
            quantity: 15,
            locale: 'ru',
            message:''}
    }

    componentDidMount() {
        this.setState({message: 'Checking local storage...'});
        getLocalLeagues().then(leagues => {
            leagues.forEach(league => {
                this.resolveTeamNames(league);
            })
            this.setState({leagues: leagues});
        }).catch(() => {
            this.setState({message: 'Local schedule is empty or out of date. Fetching data from API...'});
            this.fetchData().catch(e => {
                console.log('Problems while fetching data from APIs after mounting component');
                console.log(e);
            });
        })
    }

    async fetchData() {

        // get list of current leagues for using id's in future requests
        let currentLeagues = await getCurrentLeagues().catch(e => {throw e});

        // for all leagues that we "track"
        for(let key of req.footballData.leaguesKeys) {

            let live;
            let schedule;
            
            // get live and scheduled matches
            try {
                live = await getSchedule(key, req.footballData.liveFilter);
                schedule = await getSchedule(key, req.footballData.scheduledFilter);
            } catch(e) {
                this.setState(state => ({leagues: [...state.leagues, null]}));
                continue;
            }

            // merge all matches
            live.matches.forEach(liveMatch => {
                schedule.matches.unshift(liveMatch);
            });
            
            let league = new League(schedule.competition.name, schedule.competition.area.name);
            league.matches = schedule.matches;
            
            for(let l of currentLeagues) {
                if(l.name === league.name && (l.country === league.country || l.country === ('World' || 'Europe'))) {
                    league.logo = l.logo;
                    
                    let teams = await getTeamsInfo(l.league_id).catch(e => {throw e});

                    teams.forEach(team => {team.show = true; team.leagueName = schedule.competition.name});
                    league.teams = teams;
                    league.teamsShowed = teams.length;

                    this.resolveTeamNames(league);
                    this.setState(state => ({leagues: [...state.leagues, league]}));
                }
            }
        }

        writeLocalLeagues(this.state.leagues);
    }

    resolveTeamNames(league) {
        // finding logo for teams from schedule comparing names
        league.matches.forEach(match => {
            let arr = [];
            league.teams.forEach(team => {arr.push(team.name)});
            
            match.homeTeam = league.teams[stringSimilarity.findBestMatch(match.homeTeam.name.split('hampton').join(''), arr).bestMatchIndex];
            match.awayTeam = league.teams[stringSimilarity.findBestMatch(match.awayTeam.name.split('hampton').join(''), arr).bestMatchIndex];
        });
    }

    onChangeLeague = (league) => {
        this.setState(state => {
            let leagues = state.leagues.map(value => {
                return value?.name === league.name ? league : value
            });
            return {...leagues};
        });
    }

    onChangeTeam = (team, status) => {
        console.log(team, status);
        let obj = this.state.leagues;
        
        obj.forEach(league => {
            if(league?.name === team.leagueName) {
                league.teams.forEach(t => {
                    if(t.name === team.name) {

                        if(status === 'unchecked') {
                            t.show = false;
                            league.teamsShowed--;
                            if(league.status !== 'indeterminate') {
                                league.status = 'indeterminate';
                            } else if(league.teamsShowed === 0) {
                                league.status = 'unchecked'
                            }
                        } else {
                            if(league.teamsShowed === league.teams.length - 1) {
                                league.status = 'checked';
                            } else if(league.teamsShowed === 0) {
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

    setLocale = (e) =>  {
        this.setState({locale:e.target.value});
    }

    render() {
        // loading
        if(this.state.leagues.length === 0) {
            return (
                <div className='message-wrapper'>
                <div class="ui icon message">
                    <i class="notched circle loading icon"></i>
                    <div class="content">
                      <div class="header">
                        Just one second
                      </div>
                      <p>{this.state.message}</p>
                    </div>
                </div>
                </div>
            )
        } else {
            return (
                <div className='schedule'>

                <LocaleContext.Provider value={this.state.locale}>
                    <MatchList  leagues={this.state.leagues.filter(value => value)} 
                                quantity={this.state.quantity}
                                todayDate={new Date()} />
                </LocaleContext.Provider>
                <SelectionArea leagues={this.state.leagues}
                                onChangeLeague={this.onChangeLeague}
                                onChangeTeam={this.onChangeTeam} />

                    <select onChange={this.setLocale} value={this.state.locale} class="ui dropdown">
                        <option value="en">en</option>
                        <option value="ru">ru</option>
                    </select>

                </div>
            );
        }
    }
}
export default Schedule;
