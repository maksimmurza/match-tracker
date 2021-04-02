import React from 'react'
import Match from './Match/Match'
import { Container, SegmentGroup } from 'semantic-ui-react'
import './MatchList.css'

class MatchList extends React.Component {

    getMarkedMatches() {
        let boards = [];

        this.props.leagues.forEach(league => {
            if(league.status !== 'checked' && league.status !== 'indeterminate')
                return;
                
            let quantity;
            this.props.quantity <= league.matches.length ? 
                quantity=this.props.quantity : 
                quantity=league.matches.length;

            for(let i = 0; i < quantity; i++) {
                if(league.matches[i].homeTeam.show === true || league.matches[i].awayTeam.show === true) {
                    league.matches[i].leagueLogo = league.logo;
                    boards.push(league.matches[i]);
                }
            }
        });

        return boards;
    }

    sortByTime = (a, b) => {
        let aDate = new Date(a.utcDate);
        let bDate = new Date(b.utcDate);
        if(aDate.getMonth() - bDate.getMonth() !== 0) {
            return aDate.getMonth() - bDate.getMonth();
        } else if(aDate.getDate() - bDate.getDate() !== 0) {
            return aDate.getDate() - bDate.getDate();
        } else {
            return aDate.getTime() - bDate.getTime();
        }
    }

    render() {
        
        let boards = this.getMarkedMatches();
        boards.sort(this.sortByTime);

        boards = boards.map((board) => {
            return (
                <Match  key={board.id}
                        homeTeam={board.homeTeam} 
                        awayTeam={board.awayTeam}
                        time={board.utcDate}
                        status={board.status}
                        todayDate={this.props.todayDate}
                        leagueLogo={board.leagueLogo}
                />
            )
        });
        
        return (
            <div className='block'>
            	<SegmentGroup className='match-list'>
					{boards.length > 0 ? boards : 
                    <span className='empty-list'>Select one league at least or reload the page</span> }
            	</SegmentGroup>
            </div>
        )
    }
}

export default MatchList;

