import React from 'react'
import { Checkbox } from 'semantic-ui-react'
import './League.css'

class League extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {status: 'checked'};
    }

    handleChange(e) {
        if(this.state.status === 'checked') {
            this.setState({status: 'unchecked'}, () => {
                this.props.onChangeLeague(this.props.league, this.state.status);
            });
        } else {
            this.setState({status: 'checked'}, () => {
                this.props.onChangeLeague(this.props.league, this.state.status);
            });
        }
    }

    render() {
       
        return (
            <div>
                <Checkbox onChange={this.handleChange} defaultChecked 
                        indeterminate={this.props.league.status === 'indeterminate'}/>
                <span> {this.props.league.name}</span>
            </div>
        )
    }
}

export default League;

