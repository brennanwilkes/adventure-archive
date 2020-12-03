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
			<div className="multiInput" key={`multiInput-${this.props.identifier}`}>
				<div key={`multiInput-${this.props.identifier}-hd`}>
					<FloatingLabel
						key={`multiInput-${this.props.identifier}-hf`}
						type="text"
						label={this.props.label}
						className={`form-control ${this.props.identifier}`}
						onChange={this.props.callback} />

					<button
						key={`multiInput-${this.props.identifier}-hb`}
						className="btn btn-success"
						aria-label="Add new input field"
						onClick={event => {
						if(this.state.copies.length < 7){
							this.setState({copies:[...this.state.copies,""]});
						}
					}}>
						<FaPlusSquare size={28} key={`multiInput-${this.props.identifier}-hs`} />
					</button>
				</div>
				{
					this.state.copies.map((copy,i) => (
						<div key={`multiInput-${this.props.identifier}-${i}d`}>
							<input
								className={`form-control ${this.props.identifier} ${this.props.identifier}-c${i}`}
								aria-label={this.props.label}
								value={this.state.copies[i]}
								key={`multiInput-${this.props.identifier}-${i}i`}
								onChange={event=>{
									let copies = this.state.copies;
									copies[i] = event.target.value;
									this.setState({copies:copies});

									this.props.callback();
							}} />

							<button
								key={`multiInput-${this.props.identifier}-${i}b`}
								className="btn btn-danger"
								aria-label="Removed input field"
								onClick={event=>{
								let copies = this.state.copies.slice(0);
								copies.splice(i,1);
								this.props.callback({dropIndex:i,dropId:this.props.identifier});
								this.setState({copies:copies});

							}}>
								<FaMinusSquare size={28} key={`multiInput-${this.props.identifier}-${i}s`} />
							</button>
						</div>
					))
				}
			</div>
		</>;
	}
}


export default MultiInput;
