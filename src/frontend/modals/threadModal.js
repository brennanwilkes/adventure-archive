// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";
import axios from "axios";

import "./threadModal.css";
import FloatingLabel from "../floatingLabel/FloatingLabel.js";
import ThreadModalComment from "./threadModalComment";

/**
 * A modal displaying an entire thread
 * @class
 * @extends React.Component
 */
class ThreadModal extends React.Component {
	/**
	 * constructor - Initializes state and binds methods
	 * @param  {type} props
	 */
	constructor (props) {
		super(props);
		this.post = this.post.bind(this);
		this.resetBtn = this.resetBtn.bind(this);

		this.state = {
			btnColour: "mariana",
			btnText: "Post"
		};
	}

	/**
	 * resetBtn - Resets post button to defaults
	 */
	resetBtn () {
		this.setState({
			btnColour: "mariana",
			btnText: "Post"
		});
	}

	/**
	 * Post comment callback
	 * @param  {type} event
	 */
	post (event) {
		event.preventDefault();

		// basic UI validation
		if (this.props.user !== undefined && this.props.user.name && this.props.user.name.length > 0) {
			// Find POST route and trigger it
			this.props.comments[0].links.forEach((link, i) => {
				if (link.rel === "Post new comment" && link.action === "POST") {
					axios.post(`${link.href}`, {
						user: this.props.user.name,
						comment: $("#newComment").val(),
						threadId: String(this.props.comments[0].threadId)
					}).then(res => {
						// Update button with feedback
						this.setState({
							btnColour: "success",
							btnText: "Success"
						});
						setTimeout(this.resetBtn, 2000);
						this.props.updateCallback();
					}).catch(() => {
						// Update button with failure
						this.setState({
							btnColour: "danger",
							btnText: "Error Posting"
						});
						setTimeout(this.resetBtn, 2000);
					});
				}
			});
		} else {
			// Update button with failure
			this.setState({
				btnColour: "danger",
				btnText: "Invalid Username"
			});
			setTimeout(this.resetBtn, 2000);
		}
	}

	/**
	 * render - Renders out the modal.
	 * Header contains the thread title, body the
	 * comments, and footer the post form
	 */
	render () {
		// Ensure thread comments are in correct order
		let ordered = new Array(this.props.comments.length);
		const unordered = [];
		this.props.comments.forEach((c, i) => {
			if (c.position) {
				ordered[parseInt(c.position)] = c;
			} else {
				unordered.push(c);
			}
		});
		ordered = [...ordered, ...unordered].filter(e => e !== undefined);

		return <>
			<article className="modal bg-dark fade" id="threadModal" tabIndex="-1" role="dialog" aria-labelledby="threadModal" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="h2 modal-title text-mariana">{this.props.title}</h5>
						</div>
						<div className="modal-body py-4">{
							ordered.map(comment => <ThreadModalComment key={comment._id} data={comment} />)
						}</div>
						<div className="modal-footer row">
							<div className="col-md-8">
								<FloatingLabel
									type="text"
									label="New comment"
									id="newComment"
									className="form-control" />
							</div>
							<div className="col-md-3">
								<button
									type="button"
									id="postButton"
									aria-label="post comment"
									className={`btn btn-${this.state.btnColour} py-2`}
									onClick={this.post}>{
										this.state.btnText
									}</button>
							</div>
						</div>
					</div>
				</div>
			</article>
		</>;
	}
}

/**
 * Props may contain user object, comments array, title, and update callback.
 */
ThreadModal.propTypes = {
	user: PropTypes.object,
	comments: PropTypes.array,
	updateCallback: PropTypes.func,
	title: PropTypes.string
};

export default ThreadModal;
