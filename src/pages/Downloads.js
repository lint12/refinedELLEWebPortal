import React, { Component } from 'react';
import MainTemplate from '../pages/MainTemplate';

import '../stylesheets/style.css';
import '../lib/bootstrap/css/bootstrap.min.css';
import '../lib/font-awesome/css/font-awesome.min.css';
import '../lib/owlcarousel/assets/owl.carousel.min.css';
import '../lib/ionicons/css/ionicons.min.css';


export default class Downloads extends Component {

	render() {
	return (
	<div>
		<MainTemplate/>
		
		<section id="intro">
			<div className="intro-content">
				<h2>Downloads</h2>
			</div>
			<div id="intro-carousel" className="owl-carousel">
				<div className="item" style={{backgroundImage: 'url("../Images/intro-carousel/1.jpg")'}} />
				<div className="item" style={{backgroundImage: 'url("../Images/intro-carousel/2.jpg")'}} />
				<div className="item" style={{backgroundImage: 'url("../Images/intro-carousel/3.jpg")'}} />
				<div className="item" style={{backgroundImage: 'url("../Images/intro-carousel/4.jpg")'}} />
				<div className="item" style={{backgroundImage: 'url("../Images/intro-carousel/5.jpg")'}} />
			</div>
		</section>

		
		<section id="call-to-action" className="wow fadeInUp">
		<div className="container">
			<div className="row">
				<div className="col-lg-6 text-center text-lg-left">
				  <h3 className="cta-title">Project ELLE</h3>
				  <p className="cta-text"> Sneak through the mist and avoid enemy guards in
							this stealth game. Answer questions to survive and advance.</p>
				  <p className="cta-text">Senior Design Team:</p>
				  <ul style={{color: '#ffffff'}}>
						<li>Kalonte Jackson-Tate</li>
						<li>Eugene Lucino</li>
						<li>Chris Rodbourne</li>
						<li>Josh Sewnath</li>
						<li>Patrick Thompson</li>
				  </ul>
				  <a className="cta-btn align-middle" href="https://www.google.com/">Download</a>
				</div>
				<div className="col-lg-6 about-img">
				  <img src={require('../Images/ELLE/mobile3D.jpg')} alt="" style={{maxWidth: '100%'}} />
				</div>
			</div>
		</div>
		</section>

		<section id="call-to-action" className="wow fadeInUp" style={{background: '#50D8AF'}}>
		<div className="container">
			<div className="row">
				<div className="col-lg-6 about-img">
				  <img src={require('../Images/ELLE/mobile3D.jpg')} alt="" style={{maxWidth: '100%'}} />
				</div>
				<div className="col-lg-6 text-center text-lg-right">
				  <h3 className="cta-title">ELLE Mobile 3D</h3>
				  <p className="cta-text"> Take the power of second-language acquisition straight to
							your mobile device. With an upbeat side-scroller and a new augmented reality
							gamemode, you can learn any language on the go.</p>
				  <p className="cta-text">Senior Design Team:</p>
				  <ul style={{color: '#ffffff', textAlign: 'right', listStylePosition: 'inside'}}>
						<li>Christian Acosta</li>
						<li>Kyle Hendricks</li>
						<li>James Jachcinski</li>
						<li>Mustapha Moore</li>
						<li>Dominic Rama</li>
				  </ul>
				  <a className="cta-btn align-middle btn-right" href="https://www.google.com/">Download</a>
				</div>
			</div>
		</div>
		</section>

		<section id="call-to-action" className="wow fadeInUp">
		<div className="container">
			<div className="row">
				<div className="col-lg-6 text-center text-lg-left">
				  <h3 className="cta-title">ELLE 2.0</h3>
				  <p className="cta-text"> Enhanced and better suited to help you	learn a 
							language. Play in virtual reality or on the new side-scroller PC version.</p>
				  <p className="cta-text">Senior Design Team:</p>
				  <ul style={{color: '#ffffff'}}>
						<li>Mark Behler</li>
						<li>Phillio Da Silva</li>
						<li>Ian Holdeman</li>
						<li>Santiago Perez Arrubla</li>
				  </ul>
				  <a className="cta-btn align-middle" href="https://www.google.com/">Download</a>
				</div>
				<div className="col-lg-6">
				  <img src={require('../Images/ELLE/PC.jpg')} alt="" style={{maxWidth: '100%'}} />
				</div>
			</div>
		</div>
		</section>
		
		<section id="call-to-action" className="wow fadeInUp" style={{background: '#50D8AF'}}>
		<div className="container">
			<div className="row">
				<div className="col-lg-6 about-img">
				  <img src={require('../Images/ELLE/VR.jpg')} alt="" style={{maxWidth: '100%'}} />
				</div>
				<div className="col-lg-6 text-center text-lg-right">
				  <h3 className="cta-title">ELLE 1.0</h3>
				  <p className="cta-text"> The original. Play the virtual reality version
							on the game's very first build. NOTE: This game is NOT compatible with
							the ELLE database.</p>
				  <p className="cta-text">Senior Design Team:</p>
				  <ul style={{color: '#ffffff', textAlign: 'right', listStylePosition: 'inside'}}>
						<li>Georg Anemogiannis</li>
						<li>Eric Butt</li>
						<li>Tyler Chauhan</li>
						<li>Megan Chipman</li>
						<li>Christopher Ward (Art)</li>
				  </ul>
				  <a className="cta-btn align-middle btn-right" href="https://www.google.com/">Download</a>
				</div>
			</div>
		</div>
		</section>
		
		
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
