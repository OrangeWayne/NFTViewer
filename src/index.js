import "assets/index.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import reportWebVitals from "./reportWebVitals";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

const theme = createTheme();

function getWeb3Library(provider) {
	return new Web3(provider);
}

ReactDOM.render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<Web3ReactProvider getLibrary={getWeb3Library}>
				<App />
			</Web3ReactProvider>
		</ThemeProvider>
	</React.StrictMode>,
	document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
