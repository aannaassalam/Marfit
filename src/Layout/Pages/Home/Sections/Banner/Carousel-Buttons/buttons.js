import React from "react";
import propTypes from "prop-types";

const styles = {
	wrapper: {
		position: "absolute",
		width: "100%",
		zIndex: "100",
		bottom: "40%",
		textAlign: "center",
		backgroundColor: "rgba(255,255,255,0.8)",
	},
	btn: {
		width: "50px",
		height: "50px",
		cursor: "pointer",
		userSelect: "none",
		position: "absolute",
		bottom: "0",
		font: "30px sans-serif",
		color: "#464646",
		backgroundColor: "rgba(255,255,255,0.8)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: "50%",
		boxShadow: "0 0 5px 2px rgba(0,0,0,0.2)",
	},
	left: {
		left: "5px",
	},
	right: {
		right: "5px",
	},
};

export default function Buttons(props) {
	const prevBtnStyle = Object.assign({}, styles.btn, styles.left);
	const nextBtnStyle = Object.assign({}, styles.btn, styles.right);
	const { index, total, loop, prevHandler, nextHandler } = props;
	return (
		<div style={styles.wrapper}>
			{(loop || index !== 0) && (
				<div style={prevBtnStyle} onClick={prevHandler}>
					<div className='prevBut'>
						<div className='line'></div>
						<div className='line'></div>
					</div>
				</div>
			)}
			{(loop || index !== total - 1) && (
				<div style={nextBtnStyle} onClick={nextHandler}>
					<div className='nextBut'>
						<div className='line'></div>
						<div className='line'></div>
					</div>
				</div>
			)}
		</div>
	);
}

Buttons.propTypes = {
	index: propTypes.number.isRequired,
	total: propTypes.number.isRequired,
	prevHandler: propTypes.func,
	nextHandler: propTypes.func,
};
