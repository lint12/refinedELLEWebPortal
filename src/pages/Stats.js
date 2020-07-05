import React, {Component} from 'react';
import DeckChart from '../components/Decks/DeckChart'
import {Container} from 'reactstrap'
import Template from '../pages/Template'

class Stats extends Component{
	render(){
		return(
		<Container>	
			<Template/>
			<DeckChart/>
		</Container>)
	}
}

export default Stats;