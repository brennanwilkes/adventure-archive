// Brennan Wilkes

// Imports
import React from "react";
import PropTypes from "prop-types";
import "../bootstrap-import.js";

import "./loginModal.css";
import FloatingLabel from "../floatingLabel/FloatingLabel.js";

/**
 * A simple modal for a login panel
 * @class
 * @extends React.Component
 */
class LoginModal extends React.Component {
	/**
	 * render - Renders a basic login modal with some formatting and a
	 * single floating label text input with submit button.
	 */
	render () {
		return <>
			<article className="modal bg-dark fade" id="LoginModal" tabIndex="-1" role="dialog" aria-labelledby="LoginModal" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="h2 modal-title text-mariana">Adventure Archive</h5>
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
								aria-label="close login"
								onClick={() => this.props.loginCallback($("#loginInput")[0].value)}>
									Login
							</button>
						</div>
					</div>
				</div>
			</article>
		</>;
	}
}

/**
 * Props must contain a login callback
 */
LoginModal.propTypes = {
	loginCallback: PropTypes.func
};

export default LoginModal;
