import React, { useState } from 'react';
import GoogleAuthButton from '../GoogleAuthButton/GoogleAuthButton';
import QuantityInput from '../QuantityInput/QuantityInput';
import LocaleSelection from '../LocaleSelection/LocaleSelection';
import { Button } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';

const ControlsBar = ({
	values: { quantity, locale },
	handlers: { setQuantity, setLocale, sidebarToggle },
}) => {
	const [buttonSize, setButtonSize] = useState('regular');

	window.onresize = () => {
		const container = document.querySelector('#settings-wrapper');
		const containerChildren = Array.from(container.children);
		const availableSpace = containerChildren.reduce(
			(acc, el) => acc - el.offsetWidth,
			container.offsetWidth
		);
		if (buttonSize === 'regular' && availableSpace < 20) {
			setButtonSize('small');
		} else if (buttonSize === 'small' && availableSpace > 160) {
			setButtonSize('regular');
		}
	};

	return (
		<Bar id="bar">
			<ToggleSidebarButton icon="content" onClick={sidebarToggle}></ToggleSidebarButton>
			<SettingsWrapper id="settings-wrapper">
				<QuantityInput value={quantity} onChange={setQuantity} />
				<LocaleSelection value={locale} onChange={setLocale} />
				<GoogleAuthButton size={buttonSize}></GoogleAuthButton>
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
	& > * {
		margin: 0 10px 1rem 0 !important;
		max-width: 8rem;
	}
	@media (max-width: 767px) {
		flex-grow: 2;
		justify-content: flex-end;
		& > * {
			margin: 0 5px 0 0 !important;
			align-self: center;
		}
	}
`;

const ToggleSidebarButton = styled(Button)`
	display: none !important;
	@media (max-width: 767px) {
		display: initial !important;
		margin: 0 auto 0 0 !important;
		background-color: transparent !important;
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
