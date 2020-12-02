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
	}

	componentDidMount(){
		$("#display").css("marginTop","7.5%");
	}

	render(){
		return <>
			<div id="display">{
				this.props.comments.map(comment => (
					<p key={comment._id} >{comment.content}</p>
				))
			}</div>
		</>
	}
}

export default Display;
