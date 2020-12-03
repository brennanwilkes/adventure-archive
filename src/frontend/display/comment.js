// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";
import axios from "axios";
import unescape from "unescape";

import "./comment.css";

class Comment extends React.Component {
	constructor (props) {
		super(props);

		this.state = this.props.data;
		this.state.threadData = undefined;
		this.state.userData = undefined;
	}

	componentDidMount () {
		this._ismounted = true;

		this.state.links.forEach((link, i) => {
			if (link.rel === "thread" && link.action === "GET") {
				axios.get(link.href)
					.then(threadRes => {
						if (this._ismounted) this.setState({ threadData: threadRes.data.threads[0] });
					}).catch(error => { console.error(error); });
			} else if (link.rel === "user" && link.action === "GET") {
				axios.get(link.href)
					.then(userRes => {
						if (this._ismounted) this.setState({ userData: userRes.data.users[0] });
					}).catch(() => {});
			}
		});
	}

	componentWillUnmount () {
		this._ismounted = false;
	}

	render () {
		return <>
			<section className="comment justify-content-center row mb-5 mt-2">
				<div className="col-10 p-3 mx-5 mb-2 row">
					<header className="floatingHeaderWrapper mb-3 mt-0">
						<div className="floatingHeader row px-2 py-1 bg-mariana">
							<div
								onClick={(event) => {
									if (this.state.threadData) {
										this.props.queryCommentsCallback(`groupByThread=true&limit=250&country=${encodeURIComponent(this.state.threadData.country)}`);
									}
								}}
								className="country col-md-5 text-sandy h3 mb-0">{
									(this.state.threadData ? this.state.threadData.country : "")
								}</div>
							<div className="text-sandy col-md-1 h3 mb-0 mx-2 spacer">|</div>
							<div
								onClick={(event) => {
									if (this.state.threadData) {
										this.props.viewThreadCallback(this.state.threadData);
									}
								}}
								className="title text-jetsam col-md-5 h6 mb-0">{
									(this.state.threadData ? unescape(this.state.threadData.title) : "")
								}</div>
						</div>
						<div className="floatingFooter row mt-1 px-0 py-1">
							<div
								onClick={(event) => {
									if (this.state.threadData) {
										this.props.queryCommentsCallback(`groupByThread=true&limit=250&subforum=${encodeURIComponent(this.state.threadData.subforum)}`);
									}
								}}
								className="subforum col-md-3 bg-mariana text-sandy h6 px-1 py-1">
								{(this.state.threadData ? this.state.threadData.subforum : "")
								}</div>
							<div className="date col-md-5 bg-mariana text-jetsam h6 px-1 py-1">{this.state.date}</div>
							<div
								onClick={(event) => {
									if (this.state.userData) {
										this.props.queryCommentsCallback(`limit=250&user=${encodeURIComponent(this.state.userData._id)}`);
									}
								}}
								className="user col-md-3 bg-mariana text-jetsam h6 px-1 py-1">{
									(this.state.userData ? this.state.userData.name : "")
								}</div>
						</div>
					</header>

					<p>{
						unescape(this.state.content)
					}</p>

				</div>
			</section>
			<hr />
		</>;
	}
}

Comment.propTypes = {
	data: PropTypes.object.isRequired,
	queryCommentsCallback: PropTypes.func.isRequired,
	viewThreadCallback: PropTypes.func.isRequired
};

export default Comment;
