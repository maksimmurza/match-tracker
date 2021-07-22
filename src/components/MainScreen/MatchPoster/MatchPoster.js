import React from 'react';
import { Segment, Icon, Label, Popup } from 'semantic-ui-react';
import { LocaleContext } from '../../../context/LocaleContext';
import Notificationable from '../../Notification/Notification';
import PropTypes from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

export class MatchPoster extends React.PureComponent {
	constructor(props) {
		super(props);
		this.gapi = window.gapi;
		this.dateLabels = React.createRef();
		this.showNotification = props.showNotification;
	}

	static contextType = LocaleContext;

	hoverDateLabels = () => {
		let current = this.dateLabels.current.style.backgroundColor;

		if (current === 'rgb(232, 232, 232)') {
			this.dateLabels.current.style.backgroundColor = 'transparent';
			this.dateLabels.current.style.boxShadow = 'none';
		} else {
			this.dateLabels.current.style.backgroundColor = 'rgb(232, 232, 232)';
			this.dateLabels.current.style.boxShadow = '0 0 5px 0 rgba(0, 0, 0, 0.5)';
		}
	};

	preRender() {
		let matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel;
		let matchDate = new Date(this.props.time);
		matchDateStr = matchDate.toLocaleDateString(this.context, {
			month: 'long',
			day: 'numeric',
		});
		matchTimeStr = matchDate.toLocaleTimeString(this.context, {
			hour: 'numeric',
			minute: 'numeric',
		});
		this.prettyDate = `${matchDateStr}, ${matchTimeStr}`;

		let date = this.props.todayDate.getDate();
		let month = this.props.todayDate.getMonth();

		if (this.props.status === 'IN_PLAY' || this.props.status === 'PAUSED') {
			liveLabel = (
				<DayLabel color="red" ribbon="right">
					live
				</DayLabel>
			);
		} else if (date === matchDate.getDate() && month === matchDate.getMonth()) {
			todayLabel = (
				<DayLabel color="blue" ribbon="right">
					today
				</DayLabel>
			);
		} else if (month === matchDate.getMonth() && date + 1 === matchDate.getDate())
			tomorrowLabel = (
				<DayLabel color="teal" ribbon="right">
					tomorrow
				</DayLabel>
			);

		return [matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel];
	}

	pushEventHandler = async () => {
		if (this.gapi.auth2.getAuthInstance().isSignedIn.get() === false) {
			this.showNotification('warning', 'You should sign in!');
			return;
		}

		const summary = `${this.props.homeTeam.name} - ${this.props.awayTeam.name}`;
		const endDate = new Date(this.props.time).addHours(1.5).toISOString();
		const eventExist = await this.gapi.client.calendar.events
			.list({
				calendarId: 'primary',
				timeMin: `${this.props.time}`,
			})
			.then(response => response.result.items.filter(event => event.summary === summary).length > 0)
			.catch(error => this.showNotification('error', error));

		if (eventExist) {
			this.showNotification('warning', 'Event is already in you calendar', summary);
			return;
		}

		const gameEvent = {
			summary,
			start: {
				dateTime: `${this.props.time}`,
			},
			end: {
				dateTime: `${endDate}`,
			},
			reminders: {
				useDefault: false,
				overrides: [{ method: 'popup', minutes: 60 }],
			},
		};

		const request = this.gapi.client.calendar.events.insert({
			calendarId: 'primary',
			resource: gameEvent,
		});

		try {
			request.execute(response => {
				if (response.status === 'confirmed') {
					this.showNotification(
						'success',
						'Event successfuly created!',
						`${summary}, ${this.prettyDate}`
					);
				} else {
					this.showNotification('error', response.message, `${summary}, ${this.prettyDate}`);
				}
			});
		} catch (error) {
			this.showNotification('error', error);
		}
	};

	render() {
		const [matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel] = this.preRender();

		return (
			<MatchWrapper>
				<LabelsWrapper>
					{todayLabel}
					{tomorrowLabel}
					{liveLabel}

					<Popup
						trigger={
							<DateLabelsWrapper
								ref={this.dateLabels}
								onMouseEnter={this.hoverDateLabels}
								onMouseLeave={this.hoverDateLabels}
								onClick={this.pushEventHandler}>
								<Label>
									<Icon name="calendar" /> {matchDateStr}
								</Label>
								<Label>
									<Icon name="time" /> {matchTimeStr}
								</Label>
							</DateLabelsWrapper>
						}
						mouseEnterDelay={800}
						content="Push to the calendar"
						position="top left"
					/>
				</LabelsWrapper>

				<TeamsWrapper>
					<HomeTeamName>{this.props.homeTeam.name}</HomeTeamName>
					<TeamLogo src={this.props.homeTeam.logo} alt={this.props.homeTeam.name + 'logo'} />
					<Devider> – </Devider>
					<TeamLogo src={this.props.awayTeam.logo} alt={this.props.awayTeam.name + 'logo'} />
					<AwayTeamName>{this.props.awayTeam.name}</AwayTeamName>
				</TeamsWrapper>

				<StyledLeagueLogo src={this.props.leagueLogo} alt="League logo" width="25"></StyledLeagueLogo>
			</MatchWrapper>
		);
	}
}

const MatchWrapper = styled(Segment)`
	width: calc(100% - 1.1em) !important;
	max-height: calc(100% / 4);
	@media (max-width: 767px) {
		padding-bottom: 5px !important;
		padding-top: 5px !important;
	}
`;

const TeamsWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-items: center;
	padding-top: 5px;
	@media (max-width: 767px) {
		padding-bottom: 8px;
	}
`;

const StyledLeagueLogo = styled.img`
	position: relative;
	left: calc(100% - 2rem);
	@media (max-width: 767px) {
		display: none;
	}
`;

const DateLabelsWrapper = styled.div`
	box-shadow: none;
	background-color: transparent;
	border-radius: 5px;
	display: inline-block;
	cursor: pointer;
	transition: ease all 0.2s;
`;

const LabelsWrapper = styled.div`
	& * {
		@media (max-width: 767px) {
			font-size: 0.7rem !important;
		}
	}
`;

const DayLabel = styled(Label)`
	position: absolute !important;
	left: calc(100% + 1.2em) !important;
`;

const TeamName = styled.span`
	flex-grow: 2;
	font-size: 1.3em;
	display: inline;
	width: 300px;
	text-overflow: ellipsis;
	margin: 0;
	overflow: hidden;
	white-space: nowrap;
	@media (max-width: 767px) {
		font-size: 0.9em;
	}
`;

const HomeTeamName = styled(TeamName)`
	text-align: right;
	&::after {
		content: '';
		padding-right: 20px;
	}
`;

const AwayTeamName = styled(TeamName)`
	text-align: left;
	text-indent: 20px;
`;

const TeamLogo = styled.img`
	width: calc(35px + 3.2vw);
`;

const Devider = styled.h3`
	flex-grow: 1;
	width: 80px;
	text-align: center;
	margin: 0;
`;

MatchPoster.propTypes = {
	homeTeam: MobxPropTypes.observableObject,
	awayTeam: MobxPropTypes.observableObject,
	time: PropTypes.string,
	status: PropTypes.string,
	todayDate: PropTypes.instanceOf(Date),
	leagueLogo: PropTypes.string,
};

export default Notificationable(MatchPoster);
