import React from 'react';
import { Select } from 'semantic-ui-react';
import { PropTypes } from 'prop-types';
import styled from 'styled-components';

const LocaleSelection = ({ value, onChange }) => {
	return (
		<StyledSelect
			value={value}
			onChange={onChange}
			options={[
				{ key: 'en', value: 'en', text: 'en' },
				{ key: 'ru', value: 'ru', text: 'ru' },
			]}
		/>
	);
};

const StyledSelect = styled(Select)`
	min-width: fit-content !important;
	margin: 0 10px 0 0 !important;
`;

LocaleSelection.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func,
};

export default LocaleSelection;
