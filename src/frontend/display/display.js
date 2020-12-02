//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";

class Display extends React.Component{

	/**
		Binds methods and initializes state
		@param {any[]} props
	*/
	constructor(props){
		super(props);

		this.state = {
			comments: []
		}
	}

	componentDidMount(){
		$("#display").css("marginTop","7.5%");
	}

	render(){
		return <>
			<div id="display">

			</div>
		</>
	}
}

export default Display;
