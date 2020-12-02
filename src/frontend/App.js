import React from "react";
import "./bootstrap-import.js";
import axios from "axios";

import Navigation from "./navigation/navigation.js";
import Display from "./display/display.js";
import LoginModal from "./modals/loginModal.js";
import "./index.css";

const API = "api/v0.0.1/";
const DEFAULT_LIMIT = 25;

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

		this.state = {
			comments: [],
			threadTitle: undefined,
			user: undefined
		}

		this.getComments(`limit=${DEFAULT_LIMIT}`);
	}



	componentDidMount(){
		//Trigger margin-top autoadjustment
		this.advancedSearchToggle();
	}


	getComments(query = ""){
		axios.get(`${window.location.href}${API}comments?${query}`).then(res => {
			this.setState({
				comments: res.data.comments
			});
		}).catch(error => {});
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
		this.getComments(`search=${query}&limit=${DEFAULT_LIMIT}`);
		this.setState({
			threadTitle: undefined
		});
	}


	userClick(){
		if(this.state.user){
			this.getComments(`user=${encodeURIComponent(this.state.user._id)}`);
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
			limit: "limit"
		}

		this.getComments(Object.keys(query).reduce((search,key) => query[key].reduce((built,param) => `${built}&${trans[key]}=${param}`,search),"").slice(1));
		this.setState({
			threadTitle: undefined
		});
	}

	render() {
		return <>
			<Navigation
				searchCallback={this.search}
				advSearchCallback={this.advSearch}
				advancedSearchToggleCallback={this.advancedSearchToggle}
				userCallback={this.userClick}
				user={this.state.user} />

			<Display comments={this.state.comments} />
			<LoginModal loginCallback={name => this.getUser(name)} />
		</>;
	}
}
export default App;
