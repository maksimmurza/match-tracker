import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import './Team.css'

class Team extends React.Component {

    constructor(props) {
        super(props);
    }

    handleChange = () => {

        let team = this.props.team;

        if(team.show === true)
            this.props.onChangeTeam(team, 'unchecked');
        else
            this.props.onChangeTeam(team, 'checked');
    }

    render() {
        return (
            <div>
                <Checkbox onChange={this.handleChange} checked={this.props.team.show === true}/>
                <label> {this.props.team.name}</label>
            </div>
        )
    }
}

export default Team;