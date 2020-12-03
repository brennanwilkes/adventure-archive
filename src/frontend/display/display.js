// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";

import Comment from "./comment.js";

class Display extends React.Component {
	componentDidMount () {
		$("#display").css("marginTop", "7.5%");
	}

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

Display.propTypes = {

	comments: PropTypes.arrayOf(PropTypes.Comment).isRequired,
	viewThreadCallback: PropTypes.func.isRequired,
	advancedSearchToggleCallback: PropTypes.func.isRequired,
	queryCommentsCallback: PropTypes.func.isRequired

};

export default Display;
