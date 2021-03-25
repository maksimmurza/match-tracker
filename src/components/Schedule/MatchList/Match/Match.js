import React from 'react'
import { Segment, Icon, Label } from 'semantic-ui-react';
import './Match.css';

class Match extends React.Component {

    constructor(props) {
        super(props);
        let date = new Date(this.props.time);
        this.state = {
            date: date,
            dateStr:date.toLocaleDateString('ru', {month:'long',day:'numeric'}), 
            timeStr:date.toLocaleTimeString('ru', {hour:'numeric',minute:'numeric'})
        };
    }

    render() {
        let todayLabel, tomorrowLabel, liveLabel;
        let date = this.props.todayDate.getDate();
        let month = this.props.todayDate.getMonth();

        if(date === this.state.date.getDate() && month === this.state.date.getMonth()) {
            if(this.props.status === 'IN_PLAY' || this.props.status === 'PAUSED') {
                liveLabel = <Label color='red' ribbon='right' className='day-label'>live</Label>;
            } else
                todayLabel = <Label color='blue' ribbon='right' className='day-label'>today</Label>;
        } else if(month === this.state.date.getMonth() && date+1 === this.state.date.getDate()) 
            tomorrowLabel = <Label color='teal' ribbon='right' className='day-label'>tomorrow</Label>;

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
            
				<div className='teams'>
					<span className='home-team'>{this.props.homeTeam.name}</span>
					<img src={this.props.homeTeam.logo} alt='Team logo' width='80' />
                	<h3 className='devider'>–</h3>
					<img src={this.props.awayTeam.logo} alt='Team logo' width='80' />
					<span className='away-team'>{this.props.awayTeam.name}</span>
				</div>

                <img src={this.props.leagueLogo} alt='League logo' width='25' className='league-logo'></img>
                
            </Segment>
        )
    }
}

export default Match;