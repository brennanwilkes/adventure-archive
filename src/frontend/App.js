import React from "react";
import "./bootstrap-import.js";
import axios from "axios";

import Navigation from "./navigation/navigation.js";
import Display from "./display/display.js";
import LoginModal from "./modals/loginModal.js";
import "./index.css";

const API = "api/v0.0.1/";
const DEFAULT_LIMIT = 25;

var intervalID;

class App extends React.Component {

	/**
		Initializes state, binds methods, and queries database for initial data.
		@param {any[]} props Should contain a username
	*/
	constructor(props){
		super(props);

		this.search = this.search.bind(this);
		this.advSearch = this.advSearch.bind(this);
		this.advancedSearchToggle = this.advancedSearchToggle.bind(this);
		this.getComments = this.getComments.bind(this);
		this.userClick = this.userClick.bind(this);
		this.getUser = this.getUser.bind(this);
		this.queueGetComments = this.queueGetComments.bind(this);
		this.viewThread = this.viewThread.bind(this);

		this.state = {
			comments: [],
			threadTitle: undefined,
			user: undefined,
			nextQuery: undefined,
			queryLock: false
		}

	}



	componentDidMount(){
		//Trigger margin-top autoadjustment
		this.getComments(`limit=${DEFAULT_LIMIT}`);
		this.advancedSearchToggle();
	}


	getComments(query = ""){
		this.setState({queryLock: true});

		let rot = 0;
		if(intervalID){
			clearInterval(intervalID);
		}
		intervalID = setInterval((event)=>{
			$(".loadingIcon").css({transform : `rotate(${rot}deg)`});
			rot += 1;
		},10);

		axios.get(`${window.location.href}${API}comments?${query}`).then(res => {
			this.setState({
				comments: res.data.comments
			});

			if(this.state.nextQuery){
				this.getComments(this.state.nextQuery);
				this.setState({nextQuery: undefined});
			}
			else{
				this.setState({queryLock: false});
				clearInterval(intervalID);
				$(".loadingIcon").css({transform : 'rotate(0deg)'});
			}

		}).catch(error => {});
	}

	queueGetComments(query){
		if(this.state.queryLock){
			this.setState({nextQuery:query});
		}
		else{
			this.getComments(query);
		}
	}

	getUser(user = ""){
		axios.get(`${window.location.href}${API}users?name=${user}`).then(res => {
			this.setState({
				user: res.data.users[0]
			});
		}).catch(error => {});
	}

	/**
		Basic search callback
		@param {string} name Name of drink to search for
	*/
	search(query){
		this.queueGetComments(`search=${query}&limit=${DEFAULT_LIMIT}`);
	}


	userClick(){
		if(this.state.user){
			this.queueGetComments(`user=${encodeURIComponent(this.state.user._id)}`);
		}
		else{
			$('#LoginModal').modal();
		}
	}

	/**
		Callback to be run on component mount and advanced search toggle.
		Updates the page's top margin to accurately reflect the change in
		fixed navigation size
	*/
	advancedSearchToggle(){
		setTimeout(()=>{
			$("#display").animate({
				marginTop: `${$("#nav-wrapper").height() + 50}px`
			},200);
		},250);
	}

	/**
		Advanced search callback
		@param {object} query Contains all the data from AdvancedSearch to send to the database
	*/
	advSearch(query){

		const trans = {
			querySearch: "search",
			countrySearch: "country",
			subforumSearch: "subforum",
			limit: "limit",
			groupByThread: true
		}

		const searchQuery = Object.keys(query).reduce((search,key) => query[key].reduce((built,param) => `${built}&${trans[key]}=${param}`,search),"").slice(1);

		this.queueGetComments(searchQuery);
	}

	viewThread(thread){
		this.queueGetComments(`thread=${encodeURIComponent(thread._id)}`);
		this.setState({threadTitle:thread.title});
		console.log(thread);
	}

	render() {
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
		</>;
	}
}
export default App;
