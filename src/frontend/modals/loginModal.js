//Brennan Wilkes

//Imports
import React from "react";
import "../bootstrap-import.js";
import { FaWindowClose } from "react-icons/fa";

import "./LoginModal.css";
import FloatingLabel from "../floatingLabel/FloatingLabel.js";

class LoginModal extends React.Component{

	render(){
		return <>
			<div className="modal bg-dark fade" id="LoginModal" tabIndex="-1" role="dialog" aria-labelledby="LoginModal" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="h2 modal-title text-mariana" id="LoginModal">Adventure Archive</h5>
								</div>
									<div className="modal-body py-4">
										<FloatingLabel
											type="text"
											label="Username"
											id="loginInput"
											className="form-control" />

									</div>
								<div className="modal-footer">
							<button
								type="button"
								className="btn btn-mariana"
								data-dismiss="modal"
								onClick={() => this.props.loginCallback($("#loginInput")[0].value)}>
									Login
								</button>
						</div>
					</div>
				</div>
			</div>
		</>
	}
}

export default LoginModal;
