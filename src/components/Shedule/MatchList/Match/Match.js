import React from 'react'
import { Segment, Icon, Label, Divider } from 'semantic-ui-react';
import './Match.css';

class Board extends React.Component {

	today;
	tomorrow;

    constructor(props) {
        super(props);
		this.date = new Date(props.time);
		this.dateStr = this.date.toLocaleDateString('default', {month:'long',day:'numeric'});
		this.timeStr = this.date.toLocaleTimeString('default', {hour:'numeric',minute:'numeric'});
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
        let todayLabel, tomorrowLabel;
        let date = this.props.todayDate.getDate();
        let month = this.props.todayDate.getMonth();

        if(date === this.date.getDate() && month === this.date.getMonth()) {
            todayLabel = <Label color='blue' ribbon='right' className='day-label'>today</Label>;
            console.log('today');
        } else if(month === this.date.getMonth() && date+1 == this.date.getDate()) {
            tomorrowLabel = <Label color='teal' ribbon='right' className='day-label'>tomorrow</Label>;
            console.log('tomorrow');
        }
            

        return (
            <Segment>
                {todayLabel}
                {tomorrowLabel}
                <Label>
    				<Icon name='calendar' /> {this.dateStr}
  				</Label>
				<Label>
    				<Icon name='time' /> {this.timeStr}
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

export default Board;