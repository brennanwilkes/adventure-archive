//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";

import FloatingLabel from "../floatingLabel/FloatingLabel.js";
import MultiInput from "./multiInput/multiInput.js";
import RangeSlider from "./rangeSlider/rangeSlider.js";

/**
	Collapsable advanced search pannel with all the parameters required to search for drinks.
	@class
	@memberof frontend
	@extends React.Component
*/
class AdvancedSearchPannel extends React.Component{

	/**
		Binds methods
		@param {any[]} props
	*/
	constructor(props){
		super(props);
		this.updateSubmit = this.updateSubmit.bind(this);
	}

	/**
		Sets up event listener for hitting enter while in an input.
		On enter, will unfocus the target input.
	*/
	componentDidMount(){
		$("input").keypress(function(e) {
			if(e.which == 10 || e.which == 13) {
				$(e.target).blur();
			}
		});
	}

	/**
		Parses and manipulates input values before providing them to the given onchange callback
		@param {object} event Sneakilly can be a index to pop from the search array
	*/
	updateSubmit(event){
		const query = {};
		["querySearch","countrySearch","subforumSearch"].forEach((search, i) => {

			query[search] = $(`.${search}`).toArray().map(elem => encodeURIComponent(elem.value));
			if(event && event.dropId === search){
				query[search] = query[search].splice(event,1);
			}
		});

		query.limit = [Math.max($("#limitSlider")[0].value * 5, 1)];

		this.props.callback(query);

	}

	/**
		Renders out the full panel. Contains all inputs and connecting callback methods.
		Is fully collapsable and mobile friendly
	*/
	render(){
		return <>
			<form className="collapse bg-mariana form-group py-3" id={this.props.id} onSubmit={event=>{
				event.preventDefault();
				setTimeout(()=>{
					$("#menu").animate({
						marginTop: `${$("#nav-wrapper").height() + 50}px`
					},200);
				},250);
			}}>
				<div className="row py-2 justify-content-md-center">
					<div className="col-md-9">
						<MultiInput
							identifier="querySearch"
							callback={this.updateSubmit}
							label="Search for"
							key="querySearchKey" />
					</div>
				</div>
				<div className="row py-2 justify-content-md-center">
					<div className="col-md-9">
						<MultiInput
							identifier="countrySearch"
							callback={this.updateSubmit}
							label="Country"
							key="countrySearch" />
					</div>
				</div>
				<div className="row py-2 justify-content-md-center">
					<div className="col-md-9">
						<MultiInput
							identifier="subforumSearch"
							callback={this.updateSubmit}
							label="Sub-Forum"
							key="subforumSearch" />
					</div>
				</div>
				<div className="row py-2 justify-content-md-center">
					<div className="col-md-9">
						<RangeSlider
							id="limitSlider"
							label="Max Results"
							onChange={this.updateSubmit}
							scale={10}
							default={5}
							outputMultipler={5} />
					</div>
				</div>
			</form>
		</>
	}
}

export default AdvancedSearchPannel;
