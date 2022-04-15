import React, { Component } from 'react';
import { Button } from 'reactstrap';
import MainTemplate from '../pages/MainTemplate'; 
import Template from '../pages/Template';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';

// import banner from '../Images/ELLEDownloadsBanner.mp4';

import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({

  loaderUrl: 'Build/DevBuild415.loader.js',
  dataUrl: 'Build/DevBuild415.data',
  frameworkUrl: 'Build/DevBuild415.framework.js',
  codeUrl: 'Build/DevBuild415.wasm',
});
useEffect(function () {
    unityContext.on("GameLoaded", function (confirmation) {
		if (confirmation == 1)
			sendLogin();
    });
  }, []);
export default class MazeGameFinal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			permission: this.props.user.permission,
		}
        this.sendLogin = this.sendLogin.bind(this) 
	}  

	componentDidMount() {
		this.verifyPermission(); 
	}

	verifyPermission = () => {
		const jwt = localStorage.getItem('jwt');
		if (!jwt) {
		  this.props.history.push(this.props.location.pathname);
		}
		else {
			var jwtDecode = require('jwt-decode');	
			var decoded = jwtDecode(jwt);
			this.setState({ permission: decoded.user_claims.permission }); 
		}
	}   
	
	sendLogin() {
        // continuebutton isn't on the screen right after the game is shown
        // maybe have listener in unity call to react that then sends to unity
		const jwt = localStorage.getItem('jwt');
		unityContext.send("ContinueButton", "loginAttempt", jwt);
	  }
	  
	handleOnClickFullscreen() {
		  unityContext.setFullscreen(true);
	}
	

	render() {
	return (  
	<div className="downloadsBg">
		
		{localStorage.getItem('jwt') === null ? <MainTemplate /> : <Template permission={this.state.permission}/>}
		<h3 style={{color: '#ffffff'}}>ELLE aMAZEing Game</h3>
						<p style={{color: '#ffffff'}}className="cta-text">Senior Design Team:</p>
						<ul style={{color: '#ffffff'}}>
								<li>Annabel Bland</li>
								<li>Tyler Morejon</li>
								<li>Nathan Otis</li>
                                <li>Daniel Rodriguez</li>
                                <li>Tanner Williams</li>
						</ul>

						<center>
						{this.state.showGame && <Unity unityContext={unityContext} style={{
							height: "75%",
							width: "75%",
							border: "2px solid black",
							background: "grey",
						}}/>}
						<br />
						<br />
						<Button onClick={this.handleOnClickFullscreen}>Fullscreen</Button>
						<p></p>
						<br />
						</center>
		<footer id="footer">
			<div className="container">
				<div className="copyright">&copy; Copyright 2022 <strong>Reveal</strong>. All Rights Reserved</div>
				<div className="credits">
				{/*
				All the links in the footer should remain intact.
				You can delete the links only if you purchased the pro version.
				Licensing information: https://bootstrapmade.com/license/
				Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=Reveal
				*/}
				Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
				</div>
			</div>
		</footer>
	</div>
  );
	}
}
