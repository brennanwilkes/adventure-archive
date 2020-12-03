// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";
import axios from "axios";
import unescape from "unescape";

/**
 * A comment in a thread model
 * @class
 * @extends React.Component
 */
class ThreadModalComment extends React.Component {
	/**
	 * constructor - Initializes state data
	 * @param  {type} props
	 */
	constructor (props) {
		super(props);
		this.state = this.props.data;
		this.state.userName = "";
	}

	/**
	 * componentDidMount - Gets USER data and sets mounted flag
	 */
	componentDidMount () {
		this._ismounted = true;

		this.state.links.forEach((link, i) => {
			if (link.rel === "user" && link.action === "GET") {
				axios.get(link.href)
					.then(userRes => {
						if (this._ismounted) this.setState({ userName: userRes.data.users[0].name });
					}).catch(() => {});
			}
		});
	}

	/**
	 * componentWillUnmount - Unsets mounted flag
	 */
	componentWillUnmount () {
		this._ismounted = false;
	}

	/**
	 * renders a comment data with styling
	 */
	render () {
		return (
			<section>
				<div className="threadDetailComment">
					<div className="mr-3">
						<div className="h5 text-jetsam">{this.state.userName}</div>
						<div className="h6 text-mariana">{this.state.date}</div>
					</div>
					<p>{unescape(this.state.content)}</p>
				</div>
				<hr />
			</section>
		);
	}
}

/**
 * Props must include a data object
 */
ThreadModalComment.propTypes = {
	data: PropTypes.object.isRequired
};

export default ThreadModalComment;
