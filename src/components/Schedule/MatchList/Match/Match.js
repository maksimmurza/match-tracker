import React from 'react'
import { Segment, Icon, Label } from 'semantic-ui-react';
import './Match.css';
import {LocaleContext} from "../../LocaleContext";

class Match extends React.Component {

    static contextType = LocaleContext;

    render() {

        let matchDate = new Date(this.props.time);
        let matchDateStr = matchDate.toLocaleDateString(this.context, {month:'long',day:'numeric'}); 
        let matchTimeStr = matchDate.toLocaleTimeString(this.context, {hour:'numeric',minute:'numeric'});

        let todayLabel, tomorrowLabel, liveLabel;
        let date = this.props.todayDate.getDate();
        let month = this.props.todayDate.getMonth();

        if(date === matchDate.getDate() && month === matchDate.getMonth()) {
            if(this.props.status === 'IN_PLAY' || this.props.status === 'PAUSED') {
                liveLabel = <Label color='red' ribbon='right' className='day-label'>live</Label>;
            } else
                todayLabel = <Label color='blue' ribbon='right' className='day-label'>today</Label>;
        } else if(month === matchDate.getMonth() && date+1 === matchDate.getDate()) 
            tomorrowLabel = <Label color='teal' ribbon='right' className='day-label'>tomorrow</Label>;

        // console.log(this.context);
        
        return (
            <Segment>
                {todayLabel}
                {tomorrowLabel}
                {liveLabel}
                <Label>
    				<Icon name='calendar' /> {matchDateStr}
  				</Label>
				<Label>
    				<Icon name='time' /> {matchTimeStr}
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