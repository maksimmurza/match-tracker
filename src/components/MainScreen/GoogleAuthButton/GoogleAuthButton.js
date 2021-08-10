import React, { useState, useEffect, memo } from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '../../../utils/authOptions';
import { PropTypes } from 'prop-types';
import useCurrentWidth from '../../../hooks/useCurrentWidth';

const GoogleAuthButton = ({ parent }) => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [size, setSize] = useState('regular');
	const windowWidth = useCurrentWidth();
	const gapi = window.gapi;

	const resolveButtonSize = () => {
		const siblings = Array.from(parent.current.children).filter(el => el.id !== 'auth-button');
		const availableSpace = siblings.reduce((acc, el) => acc - el.offsetWidth, parent.current.offsetWidth);
		const button = document.querySelector('#auth-button');
		const space = availableSpace - button.offsetWidth;
		if (size === 'regular' && space < 20) {
			setSize('small');
		} else if (size === 'small' && space > 160) {
			setSize('regular');
		}
	};

	useEffect(() => {
		gapi.load('client:auth2', async () => {
			await gapi.client.init({
				apiKey: API_KEY,
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				scope: SCOPES,
			});

			if (gapi.auth2.getAuthInstance().isSignedIn.get() === true) {
				const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
				setUser(profile);
				setIsSignedIn(true);
			}
		});
	}, []);

	useEffect(() => {
		resolveButtonSize();
	}, [isSignedIn, windowWidth]);

	const handleAuthClick = () => {
		if (isSignedIn === true) {
			gapi.auth2
				.getAuthInstance()
				.signOut()
				.then(() => {
					setUser(null);
					setIsSignedIn(false);
				});
		} else {
			gapi.auth2
				.getAuthInstance()
				.signIn()
				.then(() => {
					const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
					setUser(profile);
					setIsSignedIn(true);
				});
		}
	};

	return !isSignedIn ? (
		<Button
			id="auth-button"
			icon={size === 'small'}
			onClick={handleAuthClick}
			color="blue"
			style={{ minWidth: 'fit-content' }}>
			<Icon name="google"></Icon>
			{size !== 'small' && 'Sign In'}
		</Button>
	) : (
		user && (
			<Button.Group id="auth-button" color="blue" style={{ minWidth: 'fit-content' }}>
				<Dropdown
					button
					pointing={size !== 'small'}
					className="icon"
					labeled={size !== 'small'}
					icon="google"
					text={size !== 'small' ? user.getName() : ''}>
					<Dropdown.Menu>
						<Dropdown.Item onClick={handleAuthClick} text="Sign Out" />
					</Dropdown.Menu>
				</Dropdown>
			</Button.Group>
		)
	);
};

GoogleAuthButton.propTypes = {
	parent: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]),
};

export default memo(GoogleAuthButton);
