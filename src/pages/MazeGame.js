import React, { Component } from 'react';
import { Row, Col, Card } from 'reactstrap';
import MainTemplate from '../pages/MainTemplate'; 
import Template from '../pages/Template';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';

import betterRacerPromo from '../Images/ELLEBetterRacerPromo.mp4';
import betterRacer from '../Images/ELLEBetterRacer.mp4';
import elleCardGamePromo from '../Images/ELLECardGamePromo.mp4';
import ellePC from '../Images/ELLEPC.mp4';
import elleVR from '../Images/ELLEVR.mp4';

import banner from '../Images/ELLEDownloadsBanner.mp4';

export default class Downloads extends Component {
	constructor(props) {
		super(props);

		this.state = {
			permission: this.props.user.permission
		}
	
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
		
	<iframe src="https://drive.google.com/drive/folders/1AmOvimiZW716dLY-FLZgsYDxHceXTpIy?usp=sharing" style="border:0px #000000 none;" name="Game name" scrolling="no" frameborder="1" marginheight="px" marginwidth="320px" height="320px" width="480px"></iframe>
		<footer id="footer">
			<div className="container">
				<div className="copyright">&copy; Copyright <strong>Reveal</strong>. All Rights Reserved</div>
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
