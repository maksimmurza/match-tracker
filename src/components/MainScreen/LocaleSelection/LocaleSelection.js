import React from 'react';
import { Select } from 'semantic-ui-react';
import './LocaleSelection.css';
import { PropTypes } from 'prop-types';

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

LocaleSelection.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default LocaleSelection;
