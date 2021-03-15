import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import './Team.css'

class Team extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {status: 'checked'}
    }

    handleChange(e) {
        if(this.props.team.show === true) {
                this.props.onChangeTeam(this.props.team, 'unchecked');
        } else {
                this.props.onChangeTeam(this.props.team, 'checked');
        }
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