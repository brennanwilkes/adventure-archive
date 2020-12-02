//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";

import "./comment.css";

class Comment extends React.Component{

	constructor(props){
		super(props);

		this.state = this.props.data;
	}

	render(){
		return <>
			<div className="comment justify-content-center row">
				<div className="col-10 p-3 mx-5 my-4">
					<p>
						{this.state.content}
					</p>
				</div>
			</div>
		</>
	}
}

export default Comment;
