// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";

import Comment from "./comment.js";

/**
 * Main display container for comments
 * @class
 * @extends React.Component
 */
class Display extends React.Component {
	/**
	 * componentDidMount - Updates margin with new height information
	 */
	componentDidMount () {
		$("#display").css("marginTop", "7.5%");
	}

	/**
	 * renders a list of comments
	 */
	render () {
		return <>
			<article id="display" className="container-fluid px-0">{
				this.props.comments.map(comment => <Comment key={comment._id} data={comment} viewThreadCallback={this.props.viewThreadCallback} queryCommentsCallback={(event) => {
					$("#advancedOptions").removeClass("show");
					this.props.advancedSearchToggleCallback();
					this.props.queryCommentsCallback(event);
				}}/>)
			}</article>
		</>;
	}
}

/**
 * Props must contain a comments array of comment components,
 * and view thread, advanced search toggle, and query callbacks
 */
Display.propTypes = {
	comments: PropTypes.array,
	viewThreadCallback: PropTypes.func.isRequired,
	advancedSearchToggleCallback: PropTypes.func.isRequired,
	queryCommentsCallback: PropTypes.func.isRequired
};

export default Display;
