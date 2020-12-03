// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../../bootstrap-import.js";
import { ImCog } from "react-icons/im";

import "./loadingIcon.css";

/**
 * A small cog loading icon
 * @class
 * @extends React.Component
 */
class LoadingIcon extends React.Component {
	render () {
		return <>
			<div className="loadingIcon px-0 mx-0 text-sandy btn btn-lg">
				<ImCog size={this.props.size} />
			</div>
		</>;
	}
}

/**
 * Props must contain a size
 */
LoadingIcon.propTypes = {
	size: PropTypes.number.isRequired
};

export default LoadingIcon;
