//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";

import "./navigation.css";
import AdvancedSearchPannel from "../searchPanel/advancedSearchPanel.js";
import Search from "../searchPanel/search/search.js";


/**
	Main navigation component for the menu
	@class
	@memberof frontend
	@extends React.Component
*/
class Navigation extends React.Component{

	/**
		Renders out a mobile friendly, collapsable nav bar with all search elements nested correctly.
		Connects navigation elements with callback methods
	*/
	render(){
		return <>
			<div className="fixed-top" id="nav-wrapper">
				<nav className="navbar navbar-expand-md navbar-dark text-sandy bg-mariana py-3">
					<a className="navbar-brand ml-3 nav-brand-item text-sandy" href="."><h1 className="mb-0">Adventure Archive</h1></a>
					<button className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarCollapse" onClick={event => {
						$("#advancedOptions").removeClass("show");
						this.props.advancedSearchToggleCallback();
					}}>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarCollapse">
						<ul className="mr-3 ml-3 navbar-nav mr-auto">
							<li className="nav-item active h3 mb-0">
								<a
									id="userButton"
									className="nav-link text-sandy mb-0"
									onClick={this.props.userCallback}>{this.props.user ? this.props.user.name : "Login"}</a>
							</li>
						</ul>
						<Search callback={this.props.searchCallback} advancedSearchCallback={this.props.advancedSearchToggleCallback} advancedSearch="advancedOptions"/>
					</div>
				</nav>
				<AdvancedSearchPannel id="advancedOptions" callback={this.props.advSearchCallback}/>
			</div>
		</>;
	}
}

export default Navigation;
