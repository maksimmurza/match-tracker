import React, { useState, useEffect, memo } from 'react';
import { Button, Dropdown, Icon } from 'semantic-ui-react';
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES } from '../../../utils/authOptions';
import { PropTypes } from 'prop-types';

const GoogleAuthButton = ({ parent }) => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [user, setUser] = useState(null);
	const [size, setSize] = useState('regular');
	const gapi = window.gapi;

	const resolveButtonSize = () => {
		const siblings = Array.from(parent.current.children);
		const availableSpace = siblings.reduce((acc, el) => acc - el.offsetWidth, parent.current.offsetWidth);
		if (size === 'regular' && availableSpace < 20) {
			setSize('small');
		} else if (size === 'small' && availableSpace > 160) {
			setSize('regular');
		}
	};

	window.onresize = resolveButtonSize;

	useEffect(() => {
		gapi.load('client:auth2', async () => {
			await gapi.client.init({
				apiKey: API_KEY,
				clientId: CLIENT_ID,
				discoveryDocs: DISCOVERY_DOCS,
				scope: SCOPES,
			});

			if (gapi.auth2.getAuthInstance().isSignedIn.get() === true) {
				setIsSignedIn(true);
				const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
				setUser(profile);
			}
		});
	}, []);

	useEffect(() => {
		resolveButtonSize();
	}, [user]);

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
		<Button icon={size === 'small'} primary onClick={handleAuthClick} style={{ minWidth: 'fit-content' }}>
			<Icon name="google"></Icon>
			{size !== 'small' && 'Sign In'}
		</Button>
	) : (
		user && (
			<Button.Group color="blue" style={{ minWidth: 'fit-content' }}>
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
	parent: PropTypes.node,
};

export default memo(GoogleAuthButton);
