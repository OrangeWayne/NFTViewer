import Axios from "axios";
import _ from "lodash";

const OpenSeaAPI = {
	/**
	 * @param {string} params.owner
	 * @param {number} params.offset (default : 0)
	 * @param {number} params.limit (default : 20)
	 */
	GetAssets: async (params = {}) => {
		const { owner, offset = 0, limit = 20 } = params;

		if (!owner) {
			throw "owner cannot be empty.";
		}

		const { data } = await Axios.get(
			"https://api.opensea.io/api/v1/assets",
			{
				params: {
					format: "json",
					order_direction: "desc",
					owner,
					offset,
					limit,
				},
			}
		);

		return _.get(data, "assets", []);
	},
	/**
	 * @param {string} contractAddress
	 * @param {number} tokenId
	 */
	GetDetailAsset: async (contractAddress = "", tokenId = "") => {
		if (!contractAddress || !tokenId) {
			throw "contractAddress and tokenId  cannot be empty.";
		}

		const { data = {} } = await Axios.get(
			`https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`
		);

		return data;
	},
};
export default OpenSeaAPI;
