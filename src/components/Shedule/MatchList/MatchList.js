import React from 'react'
import Match from './Match/Match'
import { Container, SegmentGroup } from 'semantic-ui-react'
import './MatchList.css'

class MatchList extends React.Component {
    constructor(props) {
        super(props);
        this.todayDate = new Date();
        this.quantity = this.props.quantity;
    }

    render() {
        let boards = [];
        let logotypes = [];

        this.props.leagues?.forEach(league => {

            let quantity;
            this.quantity <= league.matches.length ? quantity=this.quantity : quantity=league.matches.length;

            for(let i = 0; i < quantity; i++) {
                league.matches[i].leagueLogo = league.logo;
                boards.push(league.matches[i]);
            }

            logotypes = logotypes.concat(league.logotypes);
        });

        boards.sort((a, b) => {
            let aDate = new Date(a.utcDate);
            let bDate = new Date(b.utcDate);
            if(aDate.getMonth() - bDate.getMonth() != 0) {
                return aDate.getMonth() - bDate.getMonth();
            } else if(aDate.getDate() - bDate.getDate() != 0) {
                return aDate.getDate() - bDate.getDate();
            } else {
                return aDate.getTime() - bDate.getTime();
            }
        });

        console.log(boards);

        boards = boards.map((board) => {
            return (
                <Match  homeTeam={board.homeTeam.name} 
                        awayTeam={board.awayTeam.name} 
                        logotypes={logotypes}
                        time={board.utcDate}
                        todayDate={this.todayDate}
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

