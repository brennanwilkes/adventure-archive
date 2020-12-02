//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";
import axios from "axios";

import "./comment.css";

class Comment extends React.Component{

	constructor(props){
		super(props);

		this.state = this.props.data;
		this.state.threadData = undefined;
		this.state.userData = undefined;
	}

	componentDidMount(){
		this._ismounted = true;

		this.state.links.forEach((link, i) => {
			if(link.rel === "thread" && link.action === "GET"){
				axios.get(link.href)
					.then(threadRes => {
						if(this._ismounted) this.setState({threadData:threadRes.data.threads[0]})
					}).catch(error=>{console.error(error)});
			}
			else if(link.rel === "user" && link.action === "GET"){
				axios.get(link.href)
					.then(userRes => {
						if(this._ismounted) this.setState({userData:userRes.data.users[0]})
					}).catch(error=>{});
			}
		});
	}

	componentWillUnmount() {
		this._ismounted = false;
	}

	render(){
		return <>
			<div className="comment justify-content-center row my-5">
				<div className="col-10 p-3 mx-5 mt-5 mb-3">
					<div className="floatingHeader mt-2 ml-2 px-2 py-1 bg-mariana">
						<div
							onClick={(event)=>{
								if(this.state.threadData){
									this.props.queryCommentsCallback(`groupByThread=true&limit=250&country=${encodeURIComponent(this.state.threadData.country)}`);
								}
							}}
							className="country text-sandy h3 mb-0">{
								(this.state.threadData ? this.state.threadData.country: "")
						}</div>
						<div
							onClick={(event)=>{
								if(this.state.threadData){
									//this.props.queryCommentsCallback(`thread=${encodeURIComponent(this.state.threadData._id)}`);
									this.props.viewThreadCallback(this.state.threadData);
								}
							}}
							className="title text-jetsam h6 mb-0">{
								(this.state.threadData ? this.state.threadData.title: "")
						}</div>
					</div>
					<p>
						{this.state.content}
					</p>
					<div className="floatingFooter mt-2 ml-2 px-2 py-1">
						<div
							onClick={(event)=>{
								if(this.state.userData){
									this.props.queryCommentsCallback(`limit=250&user=${encodeURIComponent(this.state.userData._id)}`);
								}
							}}
							className="user bg-mariana text-jetsam h6 mx-0 mb-1 px-2 py-1">{
								(this.state.userData ? this.state.userData.name : "")
						}</div>
						<div className="date bg-mariana text-jetsam h6 mx-0 my-1 px-2 py-1">{this.state.date}</div>
						<div
							onClick={(event)=>{
								if(this.state.threadData){
									this.props.queryCommentsCallback(`groupByThread=true&limit=250&subforum=${encodeURIComponent(this.state.threadData.subforum)}`);
								}
							}}
							className="subforum bg-mariana text-sandy h6 mx-0 mt-1 px-2 py-1">
								{(this.state.threadData ? this.state.threadData.subforum : "")
						}</div>
					</div>
				</div>
			</div>
			<hr />
		</>
	}
}

export default Comment;
