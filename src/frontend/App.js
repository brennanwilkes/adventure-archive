import React from "react";
import "./bootstrap-import.js";

import Navigation from "./navigation/navigation.js";
import Display from "./display/display.js";

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

	}

	componentDidMount(){
		//Trigger margin-top autoadjustment
		this.advancedSearchToggle();
	}

	/**
		Basic search callback
		@param {string} name Name of drink to search for
	*/
	search(query){

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
		console.log(query)
	}

	render() {
		return <>
			<Navigation
				searchCallback={this.search}
				advSearchCallback={this.advSearch}
				advancedSearchToggleCallback={this.advancedSearchToggle} />

			<Display />
		</>;
	}
}
export default App;
