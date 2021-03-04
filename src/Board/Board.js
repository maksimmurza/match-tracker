import React from 'react'

class Board extends React.Component {
    constructor(props) {
        super(props);
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
            <div>
                <img src={this.getLogo(this.props.homeTeam)} width="30"></img>
                <span>{this.props.homeTeam} - {this.props.awayTeam}</span>
                <img src={this.getLogo(this.props.awayTeam)} width="30"></img>
            </div>
        )
    }
}

export default Board;