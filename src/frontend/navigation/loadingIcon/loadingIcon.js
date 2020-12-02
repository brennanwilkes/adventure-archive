//Brennan Wilkes

//Imports
import React from "react";
import "../../bootstrap-import.js";
import { ImCog } from "react-icons/im";

import "./loadingIcon.css";


class LoadingIcon extends React.Component{

	render() {
		return <>
			<button className="loadingIcon px-0 mx-0 text-sandy btn btn-lg">
				<ImCog size={this.props.size} />
			</button>
		</>
	}
}

export default LoadingIcon;
