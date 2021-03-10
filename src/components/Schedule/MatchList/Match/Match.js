import React from 'react'
import { Segment, Icon, Label } from 'semantic-ui-react';
import './Match.css';

class Match extends React.Component {

    constructor(props) {
        super(props);
        this.state = {date:'', dateStr:'', timeStr:'', status:''};

		this.date = new Date(props.time);
		this.dateStr = this.date.toLocaleDateString('default', {month:'long',day:'numeric'});
		this.timeStr = this.date.toLocaleTimeString('default', {hour:'numeric',minute:'numeric'});
    }

    static getDerivedStateFromProps(props, state) {
        let d = new Date(props.time);
        return {
            date: d, 
            dateStr: d.toLocaleDateString('default', {month:'long',day:'numeric'}), 
            timeStr: d.toLocaleTimeString('default', {hour:'numeric',minute:'numeric'}),
            status: props.status
        };
    }

    getLogo(team) {
        if(this.props.logotypes != undefined) {
            let obj = this.props.logotypes?.find(obj => {
                if(team.includes(obj.name) || obj.name.includes(team))
                    return true;
                else
                    return false;
            });


            if(obj == undefined) {
                obj = this.props.logotypes?.find(obj => {
                    if(team.slice(0,3) === obj.name.slice(0,3))
                        return true;    
                });
            }
            
            return obj?.logo;
        }
    }

    render() {
        let todayLabel, tomorrowLabel, liveLabel;
        let time = this.props.todayDate.getDate();
        let date = this.props.todayDate.getDate();
        let month = this.props.todayDate.getMonth();

        if(date === this.state.date.getDate() && month === this.state.date.getMonth()) {
            if(this.state.status === 'IN_PLAY' || 'PAUSED') {
                liveLabel = <Label color='red' ribbon='right' className='day-label'>live</Label>;
            } else {
                todayLabel = <Label color='blue' ribbon='right' className='day-label'>today</Label>;
            }
            
            // console.log('today');
        } else if(month === this.state.date.getMonth() && date+1 == this.state.date.getDate()) {
            tomorrowLabel = <Label color='teal' ribbon='right' className='day-label'>tomorrow</Label>;
            // console.log('tomorrow');
        }

        return (
            <Segment>
                {todayLabel}
                {tomorrowLabel}
                {liveLabel}
                <Label>
    				<Icon name='calendar' /> {this.state.dateStr}
  				</Label>
				<Label>
    				<Icon name='time' /> {this.state.timeStr}
  				</Label>
            
				<div className='container'>
					<span className='home-team'>{this.props.homeTeam}</span>
					<img src={this.getLogo(this.props.homeTeam)} width='80' />
                	<h3 className='devider'>–</h3>
					<img src={this.getLogo(this.props.awayTeam)} width='80' />
					<span className='away-team'>{this.props.awayTeam}</span>
				</div>

                <img src={this.props.leagueLogo} width='25' className='league-logo'></img>
                
                
				
            </Segment>
        )
    }
}

export default Match;