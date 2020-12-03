// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";

import "./navigation.css";
import AdvancedSearchPannel from "../searchPanel/advancedSearchPanel.js";
import Search from "../searchPanel/search/search.js";
import LoadingIcon from "./loadingIcon/loadingIcon.js";

/**
	Main navigation component
	@class
	@extends React.Component
*/
class Navigation extends React.Component {
	/**
		Renders out a mobile friendly, collapsable nav bar with all search elements nested correctly.
		Connects navigation elements with callback methods
	*/
	render () {
		return <>
			<header className="fixed-top" id="nav-wrapper">
				<nav className="navbar navbar-expand-md navbar-dark text-sandy bg-mariana py-3">
					<a aria-label="Reload homepage" className="navbar-brand ml-3 nav-brand-item text-sandy" href="."><h1 className="mb-0">Adventure Archive</h1></a>
					<button aria-label="Toggle advanced search panel" className="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarCollapse" onClick={event => {
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
									aria-label={this.props.user ? `Show posts by ${this.props.user.name}` : "Login"}
									onClick={this.props.userCallback}>{this.props.user ? this.props.user.name : "Login"}</a>
							</li>
						</ul>
						<LoadingIcon size={28} />
						<Search callback={this.props.searchCallback} advancedSearchCallback={this.props.advancedSearchToggleCallback} advancedSearch="advancedOptions"/>
					</div>
				</nav>
				<AdvancedSearchPannel id="advancedOptions" callback={this.props.advSearchCallback}/>
			</header>
		</>;
	}
}

/**
 * Props main contain an advanced search toggle callback,
 * a search and advanced search callback, a user callback,
 * and a user information object
 */
Navigation.propTypes = {
	advancedSearchToggleCallback: PropTypes.func,
	searchCallback: PropTypes.func,
	advSearchCallback: PropTypes.func,
	userCallback: PropTypes.func,
	user: PropTypes.object
};

export default Navigation;
