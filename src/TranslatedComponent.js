import React, { PropTypes, PureComponent } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { FormattedMessage } from 'react-intl';

export default class TranslatedComponent extends PureComponent {

	shouldComponentUpdate = shouldPureComponentUpdate;

	static propTypes = {
		component: PropTypes.string.isRequired,
		text: PropTypes.string,
	};

	static defaultProps = {
		text: '',
	};

	render() {
		const { PureComponent, text, ...rest } = this.props;

		return (
			<FormattedMessage id={text} defaultMessage={text}>
				{message => React.createElement(component, rest, [message])}
			</FormattedMessage>
		);
	}
}
