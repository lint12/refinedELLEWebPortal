import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2'

export default class GameChart extends Component {
	constructor(props){
		super(props);

		this.state = ({
			platform: this.props.platform,
			unparsedData: this.props.chartData, // [{module: "", averageScore: Number}]
			chartData: [],
			prevChartData: []
		})
	}

	componentDidMount(){
		this.parseChartData();
	}

	parseChartData = () => {
		let possibleColors=['blueViolet', 'cyan', 'lightCoral', 'moccasin', 'tan']

		let chartColors = [];
		let colorIndex = 0;

		for(let i = 0; i < this.props.chartData.length; i++){
			chartColors.push(possibleColors[colorIndex]);
			
			colorIndex++;
			
			if(colorIndex >= possibleColors.length){
				colorIndex = 0;
			}
		}

		let tempChartData = {
			labels: this.props.chartData.map(data => data.module),
			datasets: [
				{
					label: this.props.platform + '(Average Score)',
					data: this.props.chartData.map(data => data.averageScore),
					backgroundColor: chartColors
				}
			]
		};



		this.setState({
			chartData: tempChartData
		})
	}

	arraysEqual = (array1, array2) => {
	  if (array1 === array2) return true;
	  if (array1 == null || array2 == null) return false;
	  if (array1.length !== array2.length) return false;

	  for (var i = 0; i < array2.length; ++i) {
	    if (array1[i] !== array2[i]) return false;
	  }
	  return true;
	}

	render(){

		let newChartData = this.props.chartData;

		//TODO: try to find a way to do this outside of the render() function
		if(!this.arraysEqual(newChartData, this.state.prevChartData)){
			this.parseChartData();
			this.setState({
				prevChartData: this.props.chartData
			})
		}
		
		return(
			<div>
				<Bar 
					data={this.state.chartData}
					options={{	maintainAspectRatio: true,
								scales: {
					        		yAxes: [{
					            		ticks: {
					                		beginAtZero: true
					            		}
					        		}]
					    		}
					    	}}
				/>
			</div>
		)
	}


}