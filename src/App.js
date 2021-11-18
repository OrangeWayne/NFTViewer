import { useEffect, useState, useLayoutEffect } from "react";
import _ from "lodash";
import { makeStyles } from "@mui/styles";
import Helper from "utils/Helper";
import { useWeb3React } from "@web3-react/core";
import { injected } from "components/wallet/Connector";
/* API */
import OpenSeaAPI from "services/OpenSeaAPI";
/* Hook */
import useScrollBottom from "hooks/useScrollBottom";
/* Components */
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import DetailDialog from "components/DetailDialog";
import Button from "@mui/material/Button";

/* Assets */
const useStyles = makeStyles((theme) => ({
	cardContainer: {
		cursor: "pointer",
	},
	desc: {
		height: 60,
		display: "-webkit-box",
		WebkitBoxOrient: "vertical",
		WebkitLineClamp: 3,
		overflow: "hidden",
		textOverflow: "ellipsis",
	},
}));

const DialogIds = {
	DetailDialog: "DetailDialog",
};

const DefaultAddress = "0x960DE9907A2e2f5363646d48D7FB675Cd2892e91";

function App(props) {
	const classes = useStyles(props);
	const { active, account, library, connector, activate, deactivate } =
		useWeb3React();

	const [list, setList] = useState([]);
	const [dialog, setDialog] = useState();
	const [isBottom, scrollRef] = useScrollBottom();
	const [owner, setOwner] = useState(DefaultAddress);
	const [offset, setOffset] = useState(0);
	const [noMore, setNoMore] = useState(false);
	const [tokenId, setTokenId] = useState("");
	const [contractAddress, setContractAddress] = useState("");

	useEffect(() => {
		document.title = "NFT Viewer";
		init();
	}, []);

	useEffect(() => {
		/* Handle MetaMask connection change events */
		if (active) {
			setOwner(account);
		} else {
			/* If disconnected from MetaMask, set the default address to owner */
			setOwner(DefaultAddress);
		}
	}, [active, account]);

	useEffect(() => {
		if (owner) {
			/* When the owner changed, initialize the data */
			init();
		}
	}, [owner]);

	useLayoutEffect(() => {
		/* reach bottom to load more */
		if (isBottom) {
			handleLoadMore();
		}
	}, [isBottom]);

	const connectMetaMask = async () => {
		try {
			await activate(injected);
		} catch (e) {
			console.log("connectMetaMask :", e);
		}
	};

	const disconnectMetaMask = async () => {
		try {
			deactivate();
		} catch (e) {
			console.log("disconnectMetaMask :", e);
		}
	};

	const init = async () => {
		try {
			/* Get the assets of the default owner address */
			const results = await OpenSeaAPI.GetAssets({
				owner,
			});
			console.log("Assets : ", results);
			setOffset(results.length);
			setList(results);
		} catch (error) {
			console.log("init : ", error);
		}
	};

	const handleLoadMore = async () => {
		try {
			/* just for rendering progress component */
			await Helper.Wait(1000);

			const results = await OpenSeaAPI.GetAssets({
				owner,
				offset,
			});

			/* set offset and concat new assets to the list */
			setOffset(offset + results.length);
			setList((preState) => {
				return preState.concat(results);
			});

			/* confirm that opensea has no more assets */
			if (results.length < 10) {
				setNoMore(true);
			}
		} catch (error) {
			console.log("Load More Error: ", error);
		}
	};

	const renderAsset = (asset = {}) => {
		const {
			id,
			token_id = "",
			name = "",
			owner = {},
			description = "",
			image_url = "",
			asset_contract = {},
		} = asset;
		const username = _.get(owner, "user.username", "");
		const avatar = _.get(owner, "profile_img_url", "");
		const contractAddress = _.get(asset_contract, "address", "");

		return (
			<Grid item sm={6} xs={12} key={id}>
				<Card
					className={classes.cardContainer}
					onClick={() => {
						/* handle for opening detial dialog event */
						setTokenId(token_id);
						setContractAddress(contractAddress);
						/* open dialog */
						setDialog(DialogIds.DetailDialog);
					}}
				>
					<CardHeader
						avatar={<Avatar alt={username} src={avatar} />}
						title={name}
						subheader={username}
					/>
					<CardMedia
						component="img"
						height="194"
						image={image_url}
						alt={username}
					/>
					<CardContent>
						<Typography
							className={classes.desc}
							variant="body2"
							color="text.secondary"
						>
							{description}
						</Typography>
					</CardContent>
				</Card>
			</Grid>
		);
	};

	return (
		<Container maxWidth="sm" ref={scrollRef}>
			<Box display="flex" mt={3} justifyContent="center">
				<Typography variant="h4" color="text.secondary">
					List
				</Typography>
			</Box>
			<Box display="flex" mt={3} justifyContent="center">
				<Typography variant="body2" color="text.secondary">
					{`Address : ${owner || "no value"}`}
				</Typography>
			</Box>
			<Box display="flex" mt={3} mb={3} justifyContent="center">
				{active ? (
					<Button
						variant="contained"
						onClick={() => disconnectMetaMask()}
					>
						Disconnect to MetaMask
					</Button>
				) : (
					<Button
						variant="contained"
						onClick={() => connectMetaMask()}
					>
						Connect to MetaMask
					</Button>
				)}
			</Box>
			{/* render assets */}
			<Box pt={3} pb={3}>
				{list.length === 0 && (
					<Box display="flex" mt={3} mb={3} justifyContent="center">
						<Typography variant="body2" color="text.secondary">
							No data
						</Typography>
					</Box>
				)}

				<Grid container spacing={3}>
					{_.map(list, (el) => renderAsset(el))}
				</Grid>
			</Box>
			{/* load more */}
			{isBottom && !noMore && (
				<Box display="flex" mt={3} mb={3} justifyContent="center">
					<CircularProgress size={50} />
				</Box>
			)}

			<DetailDialog
				open={dialog === DialogIds.DetailDialog}
				tokenId={tokenId}
				contractAddress={contractAddress}
				onClose={() => setDialog()}
			/>
		</Container>
	);
}

export default App;
