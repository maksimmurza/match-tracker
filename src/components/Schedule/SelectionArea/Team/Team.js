import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import './Team.css'

class Team extends React.Component {

    handleChange = () => {
        let team = this.props.team;

        if(team.show === true)
            this.props.onChangeTeam(team, 'unchecked');
        else
            this.props.onChangeTeam(team, 'checked');
    }

    render() {
        return (
            <div className='team-tab-content'>
                <Checkbox data-testid="input" className='check-box-tab-content' onChange={this.handleChange} checked={this.props.team.show === true}/>
                <label className='team-name-tab-content'> {this.props.team.name}</label>
            </div>
        )
    }
}

export default Team;