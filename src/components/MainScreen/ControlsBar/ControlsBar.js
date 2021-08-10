import React from 'react';
import GoogleAuthButton from '../GoogleAuthButton/GoogleAuthButton';
import QuantityInput from '../QuantityInput/QuantityInput';
import LocaleSelection from '../LocaleSelection/LocaleSelection';
import { Button } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';
import LocalErrorBoundary from '../../ErrorBoundaries/LocalErrorBoundary';

const ControlsBar = ({
	values: { quantity, locale },
	handlers: { setQuantity, setLocale, sidebarToggle },
}) => {
	const settingsWrapperRef = React.createRef();
	return (
		<Bar id="bar">
			<ToggleSidebarButton icon="content" onClick={sidebarToggle}></ToggleSidebarButton>
			<SettingsWrapper ref={settingsWrapperRef}>
				<QuantityInput value={quantity} onChange={setQuantity} />
				<LocaleSelection value={locale} onChange={setLocale} />
				<LocalErrorBoundary>
					<GoogleAuthButton parent={settingsWrapperRef}></GoogleAuthButton>
				</LocalErrorBoundary>
			</SettingsWrapper>
		</Bar>
	);
};

export const Bar = styled.div`
	display: flex;
`;

const SettingsWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	flex-grow: 1;
	&&& > * {
		margin: 0 10px 1rem 0;
		max-width: 8rem;
	}
	@media (max-width: 767px) {
		flex-grow: 2;
		justify-content: flex-end;
		&&& > * {
			margin: 0 0 0 5px;
			align-self: center;
		}
	}
`;

const ToggleSidebarButton = styled(Button)`
	&&& {
		display: none;
		@media (max-width: 767px) {
			display: initial;
			margin: 0 auto 0 0;
			background-color: transparent;
		}
	}
`;

ControlsBar.propTypes = {
	values: PropTypes.shape({
		quantity: PropTypes.number,
		locale: PropTypes.string,
	}),
	handlers: PropTypes.objectOf(PropTypes.func),
};

export default ControlsBar;
