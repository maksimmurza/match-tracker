import React from 'react'
import { Segment, Icon, Label, Divider } from 'semantic-ui-react';
import './Match.css';

class Board extends React.Component {

	today;
	tomorrow;

    constructor(props) {
        super(props);
		let date = new Date(props.time);
		this.date = date.toLocaleDateString('default', {month:'long',day:'numeric'});
		this.time = date.toLocaleTimeString('default', {hour:'numeric',minute:'numeric'});
    }

    getLogo(team) {
        if(this.props.logotypes != undefined) {
            let obj = this.props.logotypes?.find(obj => {
                if(team.includes(obj.name))
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

        return (
            <Segment>
				<Label>
    				<Icon name='calendar' /> {this.date}
  				</Label>
				<Label>
    				<Icon name='time' /> {this.time}
  				</Label>
				{/* <Divider></Divider> */}
				<div className='container'>
					<span className='home-team'>{this.props.homeTeam}</span>
					<img src={this.getLogo(this.props.homeTeam)} width='80' />
                	<h3 className='devider'>–</h3>
					<img src={this.getLogo(this.props.awayTeam)} width='80' />
					<span className='away-team'>{this.props.awayTeam}</span>
				</div>
            </Segment>
        )
    }
}

export default Board;