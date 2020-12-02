//Brennan Wilkes

//Imports
import React from "react";
import "../../bootstrap-import.js";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";

import "./multiInput.css";
import FloatingLabel from "../../floatingLabel/FloatingLabel.js";

/**
	A self controlling, auto additonal input controller
	@class
	@memberof frontend
	@extends React.Component
*/
class MultiInput extends React.Component{

	/**
		Initializes state
		@param {any[]} Must contain an identifier and on change callback
	*/
	constructor(props){
		super(props);

		this.state = {
			copies: []
		};
	}

	/**
		Renders out a list of inputs with auto + and - buttons for adjusting the amount of inputs.
		Will automatically control values, and run on change callbacks when any change.
	*/
	render(){
		return <>
			<div className="multiInput">
				<div>
					<FloatingLabel
						type="text"
						label={this.props.label}
						className={`form-control ${this.props.identifier}`}
						onChange={this.props.callback} />

					<button className="btn btn-success" onClick={event => {
						if(this.state.copies.length < 7){
							this.setState({copies:[...this.state.copies,""]});
						}
					}}><FaPlusSquare size={28} /></button>
				</div>
				{
					this.state.copies.map((copy,i) => <>
						<div>
							<input
								className={`form-control ${this.props.identifier} ${this.props.identifier}-c${i}`}
								value={this.state.copies[i]}
								onChange={event=>{
									let copies = this.state.copies;
									copies[i] = event.target.value;
									this.setState({copies:copies});

									this.props.callback();
							}} />

							<button className="btn btn-danger" onClick={event=>{
								let copies = this.state.copies.slice(0);
								copies.splice(i,1);
								this.props.callback({dropIndex:i,dropId:this.props.identifier});
								this.setState({copies:copies});

							}}><FaMinusSquare size={28} /></button>
						</div>
					</>)
				}
			</div>
		</>;
	}
}


export default MultiInput;
