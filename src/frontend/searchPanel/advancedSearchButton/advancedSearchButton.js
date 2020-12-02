//Brennan Wilkes

//Imports
import React from "react";
import "../../bootstrap-import.js";
import { FaSlidersH } from "react-icons/fa";

import "./advancedSearchButton.css";

/**
	Auto detailed search button
	@class
	@memberof frontend
	@extends React.Component
*/
class AdvancedSearchButton extends React.Component{

	/**
		Renders a detailed button with a Fa Slider icon if a target is provided
		Will call expandCallback on click
	*/
	render(){
		if(!this.props.target){
			return <></>;
		}

		return <>
			<button
				className="AdvancedSearch-btn btn btn-light py-2"
				type="button"
				onClick={this.props.expandCallback}
				data-toggle="collapse"
				data-target={`#${this.props.target}`}>
				<FaSlidersH />
			</button>
		</>;
	}
}

export default AdvancedSearchButton;
