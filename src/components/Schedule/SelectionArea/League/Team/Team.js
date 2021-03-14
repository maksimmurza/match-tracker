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
        if(this.state.status === 'checked') {
            this.setState({status: 'unchecked'}, () => {
                this.props.onChangeTeam(this.props.team, this.state.status);
            });
        } else {
            this.setState({status: 'checked'}, () => {
                this.props.onChangeTeam(this.props.team, this.state.status);
            });
        }
    }

    render() {
        return (
            <div>
                <Checkbox onChange={this.handleChange} defaultChecked/>
                <label> {this.props.team.name}</label>
            </div>
        )
    }
}

export default Team;