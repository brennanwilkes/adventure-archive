//Brennan Wilkes

//Imports
import React from "react";
import "../../bootstrap-import.js";

import "./search.css";
import FloatingLabel from "../../floatingLabel/FloatingLabel.js";
import AdvancedSearchButton from "../advancedSearchButton/advancedSearchButton.js";

/**
	Self contained and controlling search bar
	@class
	@memberof frontend
	@extends React.Component
*/
class Search extends React.Component{

	/**
		Renders out a search bar input siblinged to an advanced search toggler.
		Connects them with callback methods.
	*/
	render(){
		return <>
			<form className="form-inline p-0 mx-3" onSubmit={event => {
				event.preventDefault();
				$(event.target).children().blur();
			}}>
				<AdvancedSearchButton target={this.props.advancedSearch} expandCallback={this.props.advancedSearchCallback} />
				<FloatingLabel
					type="text"
					label="Search"
					className="form-control"
					onChange={event => {
						this.props.callback(encodeURIComponent(event.target.value));
					}} />
			</form>
		</>;
	}
}


export default Search;
