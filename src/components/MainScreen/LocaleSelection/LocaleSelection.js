import React from 'react';
import { Select } from 'semantic-ui-react';
import './LocaleSelection.css';

const LocaleSelection = ({ value, onChange }) => {
	return (
		<Select
			value={value}
			onChange={onChange}
			className="locale-input"
			options={[
				{ key: 'en', value: 'en', text: 'en' },
				{ key: 'ru', value: 'ru', text: 'ru' },
			]}
		/>
	);
};

export default LocaleSelection;
