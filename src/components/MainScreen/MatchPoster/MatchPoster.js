import React from 'react';
import { Segment, Icon, Label, Popup } from 'semantic-ui-react';
import { LocaleContext } from '../../LocaleContext';
import Notificationable from '../../Notification/Notification';
import PropTypes from 'prop-types';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import styled from 'styled-components';

export class MatchPoster extends React.PureComponent {
	constructor(props) {
		super(props);
		this.gapi = window.gapi;
		this.showNotification = props.showNotification;
	}

	static contextType = LocaleContext;

	resolveLabels() {
		let matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel;
		const matchDate = new Date(this.props.time);
		matchDateStr = matchDate.toLocaleDateString(this.context, {
			month: 'long',
			day: 'numeric',
		});
		matchTimeStr = matchDate.toLocaleTimeString(this.context, {
			hour: 'numeric',
			minute: 'numeric',
		});
		this.prettyDate = `${matchDateStr}, ${matchTimeStr}`;

		const date = this.props.todayDate.getDate();
		const month = this.props.todayDate.getMonth();

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
		} else if (month === matchDate.getMonth() && date + 1 === matchDate.getDate()) {
			tomorrowLabel = (
				<DayLabel color="teal" ribbon="right">
					tomorrow
				</DayLabel>
			);
		}

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
		const [matchDateStr, matchTimeStr, todayLabel, tomorrowLabel, liveLabel] = this.resolveLabels();

		return (
			<MatchWrapper>
				<MobileAddEventButton
					onClick={this.pushEventHandler}
					corner="left"
					icon="calendar plus outline"></MobileAddEventButton>
				<LabelsWrapper>
					{todayLabel}
					{tomorrowLabel}
					{liveLabel}

					<Popup
						trigger={
							<DateLabelsWrapper onClick={this.pushEventHandler}>
								<Label>
									<DateLabelIcon name="calendar" /> {matchDateStr}
								</Label>
								<Label>
									<DateLabelIcon name="time" /> {matchTimeStr}
								</Label>
							</DateLabelsWrapper>
						}
						mouseEnterDelay={500}
						content="Push to the calendar"
						position="top left"
					/>
				</LabelsWrapper>

				<TeamsWrapper>
					<HomeTeamName>{this.props.homeTeam.name || 'Home team'}</HomeTeamName>
					{this.props.homeTeam.logo ? (
						<TeamLogo src={this.props.homeTeam.logo} />
					) : (
						<Icon size="big" name="shield" color="grey" />
					)}
					<Devider> – </Devider>
					{this.props.awayTeam.logo ? (
						<TeamLogo src={this.props.awayTeam.logo} />
					) : (
						<Icon size="big" name="shield" color="grey" />
					)}
					<AwayTeamName>{this.props.awayTeam.name || 'Away team'}</AwayTeamName>
				</TeamsWrapper>

				<LeagueLogo src={this.props.leagueLogo} alt="League logo" width="25"></LeagueLogo>
			</MatchWrapper>
		);
	}
}

const MatchWrapper = styled(Segment)`
	&&& {
		width: calc(100% - 1.1em);

		@media (max-width: 1366px) {
			min-height: calc(100% / 4);
			max-height: fit-content;
			@media (orientation: portrait) {
				min-height: initial;
				max-height: initial;
			}
		}
		@media (max-width: 767px) {
			padding-bottom: 5px;
			padding-top: 5px;
			min-height: initial;
			max-height: initial;
		}
	}
`;

const MobileAddEventButton = styled(Label)`
	&&& {
		display: none;
		@media (max-width: 767px) {
			display: initial;
			cursor: pointer;
		}
	}
`;

const DateLabelIcon = styled(Icon)`
	&&& {
		@media (max-width: 767px) {
			display: none;
		}
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

const LeagueLogo = styled.img`
	position: absolute;
	right: 1rem;
	bottom: 1rem;

	@media (min-width: 1367px) {
		position: relative;
		left: calc(100% - 2rem);
		bottom: 0;
	}

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
	&:hover {
		background-color: rgb(232, 232, 232);
		box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
	}
	@media (max-width: 767px) {
		display: flex;
		justify-content: center;
		pointer-events: none;
		&:hover {
			background-color: transparent;
			box-shadow: none;
		}
		&&& * {
			color: grey;
			background-color: transparent;
			padding-right: 0;
		}
	}
`;

const LabelsWrapper = styled.div`
	&&& * {
		@media (max-width: 767px) {
			font-size: 0.7rem;
		}
	}
`;

const DayLabel = styled(Label)`
	&&& {
		position: absolute;
		left: calc(100% + 1.2em);
	}
`;

const TeamName = styled.span`
	flex-grow: 2;
	font-size: 1.3rem;
	display: inline;
	width: 300px;
	text-overflow: ellipsis;
	margin: 0;
	overflow: hidden;
	white-space: nowrap;
	@media (max-width: 767px) {
		font-size: 1.1rem;
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
	showNotification: PropTypes.func,
};

export default Notificationable(MatchPoster);
