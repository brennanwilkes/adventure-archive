//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";
import { FaWindowClose } from "react-icons/fa";
import axios from "axios";
import unescape from "unescape";

import "./threadModal.css";
import FloatingLabel from "../floatingLabel/FloatingLabel.js";
import ThreadModalComment from "./threadModalComment";

class ThreadModal extends React.Component{

	constructor(props){
		super(props);
		this.post = this.post.bind(this);
		this.resetBtn = this.resetBtn.bind(this);


		this.state = {
			btnColour: "mariana",
			btnText: "Post"
		}
	}

	resetBtn(){
		this.setState({
			btnColour: "mariana",
			btnText: "Post"
		});
	}

	post(event){
		event.preventDefault();

		if(this.props.user!==undefined && this.props.user.name && this.props.user.name.length > 0){


			this.props.comments[0].links.forEach((link, i) => {
				if(link.rel === "Post new comment" && link.action === "POST"){

					axios.post(`${link.href}`,{
						user: this.props.user.name,
						comment: $("#newComment").val(),
						threadId: String(this.props.comments[0].threadId)
					}).then(res => {
						this.setState({
							btnColour: "success",
							btnText: "Success"
						});
						setTimeout(this.resetBtn,2000);
						this.props.updateCallback();

					}).catch(error => {
						this.setState({
							btnColour: "danger",
							btnText: "Error Posting"
						});
						setTimeout(this.resetBtn,2000)
					})
				}
			});
		}
		else{
			this.setState({
				btnColour: "danger",
				btnText: "Invalid Username"
			});
			setTimeout(this.resetBtn,2000)
		}
	}

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
						<div className="modal-footer row">
							<div className="col-md-8">
								<FloatingLabel
									type="text"
									label="New comment"
									id="newComment"
									className="form-control" />
							</div>
							<div className="col-md-3">
								<button
									type="button"
									id="postButton"
									className={`btn btn-${this.state.btnColour} py-2`}
									onClick={this.post}>{
										this.state.btnText
								}</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	}
}

export default ThreadModal;
