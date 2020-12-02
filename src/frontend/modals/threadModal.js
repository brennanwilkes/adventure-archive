//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";
import { FaWindowClose } from "react-icons/fa";
import unescape from "unescape";

import "./threadModal.css";
import FloatingLabel from "../floatingLabel/FloatingLabel.js";
import ThreadModalComment from "./threadModalComment";

class ThreadModal extends React.Component{

	render(){

		let ordered = new Array(this.props.comments.length);
		let unordered = [];
		this.props.comments.forEach((c, i) => {
			if(c.position){
				ordered[parseInt(c.position)] = c;
			}
			else{
				unordered.push(c);
			}
		});

		ordered = [...ordered,...unordered].filter(e => e!==undefined);

		return <>
			<div className="modal bg-dark fade" id="threadModal" tabIndex="-1" role="dialog" aria-labelledby="threadModal" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="h2 modal-title text-mariana">{this.props.title}</h5>
						</div>
						<div className="modal-body py-4">{
							ordered.map(comment => <ThreadModalComment key={comment._id} data={comment} />)
						}</div>
						<div className="modal-footer">
						</div>
					</div>
				</div>
			</div>
		</>
	}
}

export default ThreadModal;
