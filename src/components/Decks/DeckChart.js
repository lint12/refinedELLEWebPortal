import React, {Component} from 'react'
import {Bar, Line, Pie} from 'react-chartjs-2'

class DeckChart extends Component{
	constructor(props){
		super(props);

		this.state={
			deckName: "FOOD(POR)",
			deckEntries: [["bannana", 15],["cake", 7],["carrot", 12],["lobster", 5]],
			chartData: {
				labels: ['banana','cake','carrot','lobster', "mango"],
				datasets:[
				{
					label: "Frequency answered correctly",
					data:[15,7,12,5,0],
					backgroundColor:['red','blue','yellow','green','oranger']
				}
				]
			}
		}
	}

	render(){
		return(
			<div>
				<h3>FOOD (POR):</h3>
				<Bar data={this.state.chartData}
					options={{maintainAspectRation: true}}
				/>

			</div>

		)
	}
	

}

export default DeckChart;