//Brennan Wilkes

//Imports
import React from "react";
import "../../bootstrap-import.js";
import { ImCog } from "react-icons/im";

import "./loadingIcon.css";


class LoadingIcon extends React.Component{

	render() {
		return <>
			<div className="loadingIcon px-0 mx-0 text-sandy btn btn-lg">
				<ImCog size={this.props.size} />
			</div>
		</>
	}
}

export default LoadingIcon;
