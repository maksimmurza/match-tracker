import React from 'react'
import MatchList from './MatchList/MatchList'
import SelectionArea from './SelectionArea/SelectionArea'
import './Schedule.css'
import League from '../../model/Model'
import req from '../../model/RequestOptions'
import stringSimilarity from 'string-similarity'
import {LocaleContext} from "./LocaleContext";

class Schedule extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            leagues: [], 
            quantity: 15, 
            onChangeLeague: this.onChangeLeague,
            onChangeTeam: this.onChangeTeam,
            locale: 'ru',
            message:''}
        this.arr = [];
    }

    componentDidMount() {
        this.setState({message: 'Checking local storage...'});
        this.getLocalData().then(leagues => {

            leagues.forEach(league => {
                league.matches.forEach(match => {
                    let arr = [];
                    league.teams.forEach(team => {arr.push(team.name)});
                    
                    match.homeTeam = league.teams[stringSimilarity.findBestMatch(match.homeTeam.name.split('hampton').join(''), arr).bestMatchIndex];
                    match.awayTeam = league.teams[stringSimilarity.findBestMatch(match.awayTeam.name.split('hampton').join(''), arr).bestMatchIndex];
                });
            })
            
            this.setState({leagues: leagues});
            
        }).catch(() => {
            this.setState({message: 'Local schedule is empty or out of date. Fetching data from API...'});
            this.fetchData().catch(e => {
                console.log('Problems while fetching data from APIs after mounting component');
            });
        })
    }

    getLocalData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let leaguesLocal = JSON.parse(localStorage.getItem('leagues'));
                if(!leaguesLocal || leaguesLocal.length === 0) {
                    reject()
                } else {
                    
                    let today = new Date(); //  '2021-04-03T11:30:00Z'
                    leaguesLocal.forEach(league => {
                        if(league.matches.some(match => new Date(match.utcDate) < today))
                            reject();
                    })  
                    resolve(leaguesLocal);
                }
            });
        })
    }

    async fetchData() {

        let currentLeagues = await this.getCurrentLeagues().catch(e => {throw e});

        // for all leagues
        for(let key of req.footballData.leaguesKeys) {

            let live;
            let schedule;

            try {
                live = await this.getSchedule(key, req.footballData.liveFilter);
                schedule = await this.getSchedule(key, req.footballData.scheduledFilter);
            } catch(e) {
                this.arr.push(null);
                this.setState({leagues: this.arr});
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
                    
                    let teams = await this.getTeamsInfo(l.league_id).catch(e => {throw e});

                    teams.forEach(team => {team.show = true; team.leagueName = schedule.competition.name});
                    league.teams = teams;
                    league.teamsShowed = teams.length;

                    // finding logo for teams from schedule comparing names
                    league.matches.forEach(match => {
                        let arr = [];
                        league.teams.forEach(team => {arr.push(team.name)});
                        
                        match.homeTeam = league.teams[stringSimilarity.findBestMatch(match.homeTeam.name.split('hampton').join(''), arr).bestMatchIndex];
                        match.awayTeam = league.teams[stringSimilarity.findBestMatch(match.awayTeam.name.split('hampton').join(''), arr).bestMatchIndex];
                    });

                    this.arr.push(league);
                    this.setState({leagues: this.arr});
                }
            }  
        }

        if(this.state.leagues.every(league => league)) {
            localStorage.setItem('leagues', JSON.stringify(this.state.leagues));
        }
    }

    async getCurrentLeagues() {
        let source = req.rapidApi;
        const response = await fetch(source.currentSeasonLeaguesURL, source.requestOptions)
        .catch(e => {
            throw new Error(e.message);
        });

        if(response.ok) {
            const data = await response.json();
            return data.api.leagues;
        } else {
            throw new Error();
        }
    }

    async getSchedule(leagueKey, filter) {
        let source = req.footballData;
        const response = await fetch(source.leaguesBaseURL + leagueKey + filter, source.requestOptions)
        .catch(e => {
            throw new Error(e.message + " (Possibly because of too much requets per minute");
        });

        if(response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error();
        }
    }

    async getTeamsInfo(leagueId) {
        let source = req.rapidApi;
        const response = await fetch(source.leaguesBaseURL + leagueId, source.requestOptions)
        .catch(e => {
            throw new Error(e.message);
        });

        if(response.ok) {
            const data = await response.json();
            return data.api.teams;
        } else {
            throw new Error();
        }
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
