import React from 'react'
import './Team.css'

class Team extends React.Component {

    constructor(props) {
        super(props);
        this.state = {team:{}}
    }

    // static getDerivedStateFromProps(props, state) {
    //     return {team: props.team};
    // }

    render() {
    //    console.log(this.props.team);
        return (
            <div>
                <input type="checkbox"></input>
                <label> {this.props.team.name}</label>
            </div>
        )
    }
}

export default Team;