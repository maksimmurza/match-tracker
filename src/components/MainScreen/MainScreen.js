import React from 'react';
import MatchList from './MatchList/MatchList';
import SelectionArea from './SelectionArea/SelectionArea';
import { LocaleContext } from '../LocaleContext';
import { Grid, Message, Icon } from 'semantic-ui-react';
import notificationable from '../Notification/Notification';
import ControlsBar from './ControlsBar/ControlsBar';
import MobileSidebar from '../MobileSidebar/MobileSidebar';
import { LEAGUES_KEYS } from '../../utils/requestOptions';
import { getLocalLeagues } from '../../utils/localStorage';
import { writeLocalLeagues } from '../../utils/localStorage';
import { observer } from 'mobx-react';
import { PropTypes } from 'prop-types';
import LeaguesStore from '../../mobx/LeaguesStore/LeaguesStore';
import styled from 'styled-components';

class MainScreen extends React.Component {
	constructor(props) {
		super(props);
		this.showNotification = props.showNotification;
		this.state = {
			quantity: 15,
			locale: 'ru',
			sidebarVisible: false,
			message: '',
		};
	}

	componentDidMount() {
		this.setState({ message: 'Checking local storage...' });
		getLocalLeagues().then(({ localLeagues, outOfDate }) => {
			if (localLeagues && !outOfDate) {
				this.props.store.getLeaguesFromLocal(localLeagues).then(() => {
					this.showNotification('', 'Loaded from local storage');
				});
			} else {
				this.setState({
					message: 'Local schedule is empty or out of date. Fetching data from API...',
				});
				this.props.store
					.getLeaguesFromAPI(localLeagues)
					.then(() => {
						writeLocalLeagues(this.props.store.leagues, new Date());
						this.showNotification('', 'Loaded from API');
					})
					.catch(e => {
						console.log('Problems while fetching data from APIs after mounting component');
						console.log(e);
					});
			}
		});
	}

	setLocale = (event, selected) => {
		this.setState({ locale: selected.value });
	};

	setQuantity = event => {
		this.setState({ quantity: event.target.value });
	};

	sidebarToggle = () => {
		this.setState(state => ({ sidebarVisible: !state.sidebarVisible }));
	};

	render() {
		const leagues = this.props.store.leagues;
		if (leagues.length < LEAGUES_KEYS.length && !leagues.some(l => l?.matches)) {
			return (
				<Grid centered>
					<Grid.Column style={{ marginTop: '2rem' }} computer={8} tablet={10} mobile={14}>
						<Message icon>
							<Icon name="circle notched" loading />
							<Message.Content>
								<Message.Header>Just one second</Message.Header>
								<p>{this.state.message}</p>
							</Message.Content>
						</Message>
					</Grid.Column>
				</Grid>
			);
		} else {
			return (
				<MobileSidebar
					sidebarContent={<SelectionArea leagues={leagues} />}
					sidebarVisible={this.state.sidebarVisible}
					sidebarToggle={this.sidebarToggle}>
					<StyledGrid stackable centered reversed="mobile">
						<MatchListColumn computer={9} tablet={10} mobile={16}>
							<LocaleContext.Provider value={this.state.locale}>
								<MatchList
									leagues={leagues}
									quantity={this.state.quantity}
									todayDate={new Date()}
								/>
							</LocaleContext.Provider>
						</MatchListColumn>
						<ControlsColumn computer={5} tablet={6} mobile={16}>
							<ControlsBar
								values={{ quantity: this.state.quantity, locale: this.state.locale }}
								handlers={{
									setQuantity: this.setQuantity,
									setLocale: this.setLocale,
									sidebarToggle: this.sidebarToggle,
								}}
							/>
							<SelectionArea leagues={leagues} />
						</ControlsColumn>
					</StyledGrid>
				</MobileSidebar>
			);
		}
	}
}

const StyledGrid = styled(Grid)`
	&&& {
		@media (min-width: 1600px) {
			padding: 0 10vw 0 10vw;
		}
		@media (min-width: 2560px) {
			padding: 0 15vw 0 15vw;
		}
	}
`;

const MatchListColumn = styled(Grid.Column)`
	&&&&& {
		@media (max-width: 767px) {
			padding: 0 !important;
		}
	}
`;

const ControlsColumn = styled(Grid.Column)`
	&&&&& {
		margin: 1rem 0 0 0;
		height: 100vh;
		display: flex;
		flex-direction: column;
		@media (max-width: 767px) {
			height: initial;
			padding: 5px !important;
			margin-top: 1rem !important;
		}
	}
`;

MainScreen.propTypes = {
	store: PropTypes.instanceOf(LeaguesStore),
	showNotification: PropTypes.func,
};

export default notificationable(observer(MainScreen));
