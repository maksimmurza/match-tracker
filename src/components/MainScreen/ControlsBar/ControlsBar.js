import React, { useState } from 'react';
import GoogleAuthButton from '../GoogleAuthButton/GoogleAuthButton';
import QuantityInput from '../QuantityInput/QuantityInput';
import LocaleSelection from '../LocaleSelection/LocaleSelection';
import { Button } from 'semantic-ui-react';
import './ControlsBar.css';

const ControlsBar = ({
	values: { quantity, locale },
	handlers: { setQuantity, setLocale, sidebarToggle },
}) => {
	const [buttonSize, setButtonSize] = useState('regular');

	window.onresize = () => {
		const container = document.querySelector('.settings-wrapper');
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
		<div className="bar">
			<Button
				icon="content"
				className="toggle-sidebar"
				style={{ backgroundColor: 'transparent' }}
				onClick={sidebarToggle}></Button>

			<div className="settings-wrapper">
				<QuantityInput value={quantity} onChange={setQuantity} />
				<LocaleSelection value={locale} onChange={setLocale} />
				<GoogleAuthButton size={buttonSize}></GoogleAuthButton>
			</div>
		</div>
	);
};

export default ControlsBar;
