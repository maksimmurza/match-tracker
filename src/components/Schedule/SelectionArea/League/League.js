import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import './League.css'

class League extends React.Component {
    
    constructor(props) {
        super(props);
    }

    handleChange = () => {
        let league = this.props.league;
        
        league.teams.forEach(team => {
            if(league.status === 'unchecked') {
                team.show = true;
                league.teamsShowed = league.teams.length;
            } else {
                team.show = false;
                league.teamsShowed = 0;
            }
        });


        if(league.status === 'unchecked')
            league.status = 'checked';
        else
            league.status = 'unchecked';

        this.props.onChangeLeague(league);
    }

    render() {
        return (
            <div>
                <Checkbox onChange={this.handleChange} 
                        checked={this.props.league.status === 'checked'} 
                        indeterminate={this.props.league.status === 'indeterminate'}/>
                <span> {this.props.league.name}</span>
            </div>
        )
    }
}

export default League;

