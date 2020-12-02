//Brennan Wilkes

//Imports
import React from "react";
import "../../bootstrap-import.js";

import "./rangeSlider.css";

/**
	A custom controlled slider input
	@class
	@memberof frontend
	@extends React.Component
*/
class RangeSlider extends React.Component{

	/**
		Initializes state
		@param {any[]} props Should have a default value, label , id, scale and output multipler
	*/
	constructor(props){
		super(props);
		this.state = {
			val: (this.props.default ? this.props.default : 0)
		}
	}

	/**
		Renders a div wrapped range input, with auto updating output value.
		Manipulates output according to prop parameters
	*/
	render(){
		return <>
			<div className="range">
				<output className="output-label" >{this.props.label}</output>
				<input
					type="range"
					className="form-control py-0"
					id={this.props.id}
					name="range"
					value={this.state.val}
					onChange={(event) => {

						let rounded = Math.round(event.target.value/this.props.scale)*this.props.scale;
						let prev = this.state.val;
						this.setState({val:rounded});

						let output = rounded * (this.props.outputMultipler?this.props.outputMultipler: 1)

						output = Math.max(1, output);

						$(`#${this.props.id}-output`)[0].value = output;
						$(`#${this.props.id}`)[0].value = rounded;

						if(rounded !== prev){
							this.props.onChange();
						}
				}} />
				<output
					className="output-val"
					id={`${this.props.id}-output`}
					value={Math.max(1,this.state.val * (this.props.outputMultipler ? this.props.outputMultipler: 1))} >{
						Math.max(1,this.state.val * (this.props.outputMultipler ? this.props.outputMultipler: 1))
				}</output>
			</div>
		</>
	}
}

export default RangeSlider;
