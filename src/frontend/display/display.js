//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";

import Comment from "./comment.js";

class Display extends React.Component{

	componentDidMount(){
		$("#display").css("marginTop","7.5%");
	}


	render(){
		return <>
			<div id="display" className="container-fluid px-0">{
				this.props.comments.map(comment => <Comment key={comment._id} data={comment} />)
			}</div>
		</>
	}
}

export default Display;
