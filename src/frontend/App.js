// Brennan Wilkes

// Imports
import React from "react";
import "./bootstrap-import.js";
import axios from "axios";

import Navigation from "./navigation/navigation.js";
import Display from "./display/display.js";
import LoginModal from "./modals/loginModal.js";
import ThreadModal from "./modals/threadModal.js";
import "./index.css";

/**
 * Current latest api route
 * @type {string}
 * @const
 */
const API = "api/v0.0.1/";

/**
 * Default limit on initial page load
 * @type {number}
 * @const
 */
const DEFAULT_LIMIT = 25;

/**
 * Loading icon animation interval ID
 * @type {number}
 */
let intervalID;

/**
 * Main Adventure Archive App Component.
 * Renders out main route level sub-components,
 * manages all global state information, and links
 * subcomponents together using callback methods
 * @class
 * @extends React.Component
 */
class App extends React.Component {
	/**
		Initializes state, binds methods.
		@param {any[]} props Should contain a username
	*/
	constructor (props) {
		super(props);

		this.search = this.search.bind(this);
		this.advSearch = this.advSearch.bind(this);
		this.advancedSearchToggle = this.advancedSearchToggle.bind(this);
		this.getComments = this.getComments.bind(this);
		this.userClick = this.userClick.bind(this);
		this.getUser = this.getUser.bind(this);
		this.queueGetComments = this.queueGetComments.bind(this);
		this.viewThread = this.viewThread.bind(this);
		this.update = this.update.bind(this);

		this.state = {
			comments: [],
			threadComments: [],
			threadTitle: undefined,
			user: undefined,
			nextQuery: undefined,
			nextQueryIsThread: undefined,
			queryLock: false,
			lastQuery: undefined
		};
	}

	/**
	 * componentDidMount - Auto adjusts margins and initializes comment data
	 */
	componentDidMount () {
		// Get Comment data from api
		this.getComments(`random=${DEFAULT_LIMIT}`);

		// Trigger margin-top autoadjustment
		this.advancedSearchToggle();
	}

	/**
	 * getComments - Calls API and updates either comments or threadComments.
	 * Self calls if a new query is queued
	 * @param  {string} query Query to request. Defaults to blank
	 * @param  {boolean} threadCommentMode Toggle for inserting into thread comments. Defaults to false.
	 */
	getComments (query = "", threadCommentMode = false) {
		// Lock comment requests
		this.setState({ queryLock: true });

		// Initialize cog spin animation
		let rot = 0;
		if (intervalID) {
			clearInterval(intervalID);
		}
		intervalID = setInterval((event) => {
			$(".loadingIcon").css({ transform: `rotate(${rot}deg)` });
			rot += 1;
		}, 10);

		// Execute query
		axios.get(`${window.location.href}${API}comments?${query}`).then(res => {
			// Update record
			this.setState({ lastQuery: query });

			// Insert data
			if (threadCommentMode) {
				this.setState({ threadComments: res.data.comments });
			} else {
				this.setState({ comments: res.data.comments });
			}

			// Run next query in queue if exists
			if (this.state.nextQuery) {
				this.getComments(this.state.nextQuery, this.state.nextQueryIsThread);
				this.setState({ nextQuery: undefined });
			} else {
				// Release log and stop cog animation
				this.setState({ queryLock: false });
				clearInterval(intervalID);
				$(".loadingIcon").css({ transform: "rotate(0deg)" });
			}
		}).catch(() => {});
	}

	/**
	 * queueGetComments - Queue handler interface for requesting data
	 * @param  {string} query Query to request. Defaults to blank
	 * @param  {boolean} threadCommentMode Toggle for inserting into thread comments. Defaults to false.
	 */
	queueGetComments (query, threadComments = false) {
		// Add to queue if locked
		if (this.state.queryLock) {
			this.setState({
				nextQuery: query,
				nextQueryIsThread: threadComments
			});
		} else {
			// Initialize queue if not
			this.getComments(query, threadComments);
		}
	}

	/**
	 * getUser - Gets user data from API call
	 * @param  {type} user User name to request. Defaults to "", which will return no data
	 */
	getUser (user = "") {
		// Exit out if no user is proivded.
		// Avoids a garuenteed 422
		if (user.length < 1) {
			return;
		}

		// Request user information
		axios.post(`${window.location.href}${API}users`, { name: user }).then(res => {
			this.setState({
				user: res.data.users[0]
			});
		}).catch(() => {});
	}

	/**
		Basic search callback
		@param {string} name Name of comments to search for. Defaults limit
	*/
	search (query) {
		this.queueGetComments(`search=${query}&limit=${DEFAULT_LIMIT}`);
	}

	/**
	 * userClick - Callback for user button. Launches login modal or queries for user's comments
	 */
	userClick () {
		if (this.state.user) {
			this.queueGetComments(`user=${encodeURIComponent(this.state.user._id)}`);
		} else {
			$("#LoginModal").modal();
		}
	}

	/**
		Callback to be run on component mount and advanced search toggle.
		Updates the page's top margin to accurately reflect the change in
		fixed navigation size
	*/
	advancedSearchToggle () {
		setTimeout(() => {
			$("#display").animate({
				marginTop: `${$("#nav-wrapper").height() + 50}px`
			}, 200);
		}, 250);
	}

	/**
		Advanced search callback
		@param {object} query Contains all the data from AdvancedSearch to send to the database
	*/
	advSearch (query) {
		const trans = {
			querySearch: "search",
			countrySearch: "country",
			subforumSearch: "subforum",
			limit: "limit",
			groupByThread: "groupByThread"
		};

		// Convert query object into query string
		const searchQuery = Object.keys(query).reduce((search, key) => query[key].reduce((built, param) => `${built}&${trans[key]}=${param}`, search), "").slice(1);

		// Execute query
		this.queueGetComments(searchQuery);
	}

	/**
	 * viewThread - Requests thread specific data and launches thread modal
	 * @param  {string} thread Thread id to search for
	 */
	viewThread (thread) {
		this.queueGetComments(`thread=${encodeURIComponent(thread._id)}`, true);
		this.setState({ threadTitle: thread.title });
		$("#threadModal").modal();
	}

	/**
	 * update - Callback to fire when a data refresh is required
	 * @param  {object} event
	 */
	update (event) {
		if (this.state.lastQuery) {
			this.queueGetComments(this.state.lastQuery);
		}
	}

	/**
	 * Renders a navigation, display, and modals.
	 * Links together with callbacks
	 */
	render () {
		return <>
			<Navigation
				searchCallback={this.search}
				advSearchCallback={this.advSearch}
				advancedSearchToggleCallback={this.advancedSearchToggle}
				userCallback={this.userClick}
				user={this.state.user} />

			<Display
				comments={this.state.comments}
				queryCommentsCallback={this.queueGetComments}
				advancedSearchToggleCallback={this.advancedSearchToggle}
				viewThreadCallback={this.viewThread} />
			<LoginModal loginCallback={name => this.getUser(name)} />
			<ThreadModal
				title={this.state.threadTitle}
				user={this.state.user}
				comments={this.state.threadComments}
				updateCallback={this.update} />
		</>;
	}
}
export default App;
