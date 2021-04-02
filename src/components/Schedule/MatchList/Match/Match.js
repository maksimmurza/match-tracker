import React from 'react'
import { Segment, Icon, Label } from 'semantic-ui-react';
import './Match.css';
import {LocaleContext} from "../../LocaleContext";

class Match extends React.Component {

    constructor(props) {
        super(props);
        this.dateLabels = React.createRef();
    }

    static contextType = LocaleContext;

    hoverDateLabels = () => {
        let current = this.dateLabels.current.style.backgroundColor;

        if(current === 'rgb(232, 232, 232)') {
            this.dateLabels.current.style.backgroundColor = 'transparent';
            this.dateLabels.current.style.boxShadow = 'none';
        } else {
            this.dateLabels.current.style.backgroundColor = 'rgb(232, 232, 232)';
            this.dateLabels.current.style.boxShadow = '0 0 5px 0 rgba(0, 0, 0, 0.5)';

        }        
    }

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
        
        return (
            <Segment className='match'>
                {todayLabel}
                {tomorrowLabel}
                {liveLabel}

                <div ref={this.dateLabels} 
                    onMouseEnter={this.hoverDateLabels} 
                    onMouseLeave={this.hoverDateLabels} 
                    className='date-labels-container' 
                    title='Push to the calender'>
                    <Label className='date-label'>
    			    	<Icon name='calendar' /> {matchDateStr}
  				    </Label>
				    <Label className='date-label'>
    			    	<Icon name='time' /> {matchTimeStr}
  				    </Label>
                </div>
            
				<div className='teams'>
					<span className='home-team'>{this.props.homeTeam.name}</span>
					<img src={this.props.homeTeam.logo} alt='Team logo' className='team-logo' />
                	<h3 className='devider'>–</h3>
					<img src={this.props.awayTeam.logo} alt='Team logo' className='team-logo' />
					<span className='away-team'>{this.props.awayTeam.name}</span>
				</div>

                <img src={this.props.leagueLogo} alt='League logo' width='25' className='league-logo'></img>
                
            </Segment>
        )
    }
}

export default Match;