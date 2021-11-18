import _ from "lodash";

const func = (props) => props;

const Helper = {
	/**
	 * @param {number} milliseconds
	 * @param {function} callback
	 */
	Wait: (milliseconds = 0, callback = func) =>
		new Promise((resolve, reject) => {
			if (milliseconds <= 0) {
				resolve(callback());
				return;
			}
			setTimeout(() => resolve(callback()), milliseconds);
		}),
};

export default Helper;
