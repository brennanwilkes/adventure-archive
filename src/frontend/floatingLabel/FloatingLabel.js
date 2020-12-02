//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";

import "./FloatingLabel.css";

/**
	A floating label input component.
	Cleanly transitions an input placeholder to a upper left floated label
	@class
	@memberof frontend
	@extends React.Component
*/
class FloatingLabel extends React.Component{

	/**
		Initializes state and binds methods
		@param {any[]} props Should contain any input classes, the input id, the label text, and optionally an onChange callback
		@constructor
	*/
	constructor(props){
		super(props);
		this.handleTextChange = this.handleTextChange.bind(this);

		this.state = {
			isActive: false,
			text: ""
		}
	}

	/**
		Event callback for input changes.
		Updates state to comply with React standard
		controlled input elements
		@param {object} event
	*/
	handleTextChange(event) {
		this.setState({
			isActive:event.target.value!=="",
			text:event.target.value
		});
	}

	/**
		Renders a form input with all the required callback and id information
		nested within a div, and sibling to a label
	*/
	render(){
		return <>
			<div className="floating-label">
				<input
					className={`pb-1 pt-3 ${this.props.className}`}
					type={this.props.type}
					id={this.props.id ? this.props.id : `floating-label${parseInt(Math.random()*1000)}`}
					value={this.state.text}
					onChange={event => {
						this.handleTextChange(event);
						if(this.props.onChange){
							this.props.onChange(event);
						}
					}} />

				<label className={`pl-3 ${this.state.isActive ? "floating-label-active" : ""}`}>
					{this.props.label}
				</label>
			</div>
		</>;
	}
}

export default FloatingLabel;
