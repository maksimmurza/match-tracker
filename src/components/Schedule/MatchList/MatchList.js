import React from 'react'
import Match from './Match/Match'
import { Container, SegmentGroup } from 'semantic-ui-react'
import './MatchList.css'

class MatchList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {leagues:[], todayDate: new Date(), quantity: this.props.quantity};

        this.sortFunction = this.sortFunction.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        return {leagues: props.leagues, todayDate: state.todayDate, quantity: state.quantity};
    }

    sortFunction(a, b) {
        let aDate = new Date(a.utcDate);
        let bDate = new Date(b.utcDate);
        if(aDate.getMonth() - bDate.getMonth() != 0) {
            return aDate.getMonth() - bDate.getMonth();
        } else if(aDate.getDate() - bDate.getDate() != 0) {
            return aDate.getDate() - bDate.getDate();
        } else {
            return aDate.getTime() - bDate.getTime();
        }
    }

    render() {
        let boards = [];
        let logotypes = [];

        this.state.leagues.forEach(league => {

            let quantity;

            this.state.quantity <= league.matches.length ? 
                quantity=this.state.quantity : 
                quantity=league.matches.length;

            for(let i = 0; i < quantity; i++) {
                league.matches[i].leagueLogo = league.logo;
                boards.push(league.matches[i]);
            }

            logotypes = logotypes.concat(league.teams);
        });

        boards.sort(this.sortFunction);

        boards = boards.map((board) => {
            return (
                <Match  homeTeam={board.homeTeam.name} 
                        awayTeam={board.awayTeam.name} 
                        logotypes={logotypes}
                        time={board.utcDate}
                        status={board.status}
                        todayDate={this.state.todayDate}
                        leagueLogo={board.leagueLogo} 
                />
            )
        });
        
        return (
            <Container text className='match-list'>
            	<SegmentGroup>
					{boards}
            	</SegmentGroup>
            </Container>
        )
    }
}

export default MatchList;

