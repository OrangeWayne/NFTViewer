import React, { useEffect, useState } from "react";
import _ from "lodash";
import { makeStyles } from "@mui/styles";

/* API */
import OpenSeaAPI from "services/OpenSeaAPI";

/* Components */
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

/* Icons */
import ChevronLeftIcon from "mdi-react/ChevronLeftIcon";

/* Assets */
const useStyles = makeStyles((theme) => ({
	cardContainer: {
		width: "100%",
	},
	description: {
		paddingBottom: 96,
	},
}));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="right" ref={ref} {...props} />;
});

const func = () => {};

function DetailDialog(props) {
	const { open, onClose = func, tokenId = "", contractAddress = "" } = props;
	const classes = useStyles();

	const [asset, setAsset] = useState({});

	const {
		name = "",
		description = "",
		image_url = "",
		collection = {},
		permalink = "",
	} = asset;

	useEffect(() => {
		/* When the tokenId is changed, fetch the asset detail info */
		if (tokenId && contractAddress) {
			fetchAsset();
		}
	}, [tokenId, contractAddress]);

	const fetchAsset = async () => {
		try {
			const newAsset = await OpenSeaAPI.GetDetailAsset(
				contractAddress,
				tokenId
			);
			console.log("fetchAsset : ", newAsset);
			setAsset(newAsset);
		} catch (error) {
			console.log("fetchAsset Error : ", error);
		}
	};

	const handleCloseEvent = () => {
		/* clear data */
		setAsset({});
		onClose();
	};

	return (
		<Dialog
			fullScreen={true}
			TransitionComponent={Transition}
			open={open}
			aria-labelledby="responsive-dialog-title"
		>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				<IconButton
					aria-label="close"
					onClick={() => handleCloseEvent()}
					sx={{
						position: "absolute",
						left: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<ChevronLeftIcon />
				</IconButton>
				<Box display="flex" justifyContent="center">
					{collection.name}
				</Box>
			</DialogTitle>
			<DialogContent>
				<Container maxWidth="sm">
					<Card className={classes.cardContainer}>
						<CardMedia
							component="img"
							image={image_url}
							alt={image_url}
						/>
					</Card>
					<Box mt={2}>
						<Typography className={classes.desc} variant="h4">
							{name}
						</Typography>
					</Box>
					<Box mb={3}>
						<Typography
							className={classes.description}
							variant="body2"
							color="text.secondary"
						>
							{description}
						</Typography>
					</Box>

					<Box display="flex" mt={3} justifyContent="center">
						<Button
							sx={{
								position: "absolute",
								bottom: 24,
								maxWidth: 552,
								width: "90%",
							}}
							variant="contained"
							onClick={() => window.open(permalink, "_blank")}
						>
							Permalink
						</Button>
					</Box>
				</Container>
			</DialogContent>
		</Dialog>
	);
}

export default DetailDialog;
