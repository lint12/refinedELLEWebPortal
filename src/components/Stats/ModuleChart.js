import React, { Component } from 'react';
import {Bar} from 'react-chartjs-2'
import {Row, Col} from 'reactstrap'

export default class ModuleChart extends Component {
	constructor(props){
		super(props);

		this.state = ({
			moduleName: this.props.moduleName,
			unparsedData: this.props.chartData, // [{platform: "", averageScore: Number, averageSessionLength: Number}]
			scoreData: [],
			sessionLengthData: [],
			prevChartData: []
		})
	}

	componentDidMount(){
		this.parseScoreData();
		this.parseSessionLengthData();
	}

	getColors = (chartType) => {
		
		let possibleColors = [];
		if(chartType === 0){
			possibleColors=['blueViolet', 'cyan', 'lightCoral', 'moccasin', 'tan']
		} else{
			possibleColors=['Olive', 'Tomato', 'SandyBrown', 'MediumTurquoise', 'LightBlue']
		}

		let chartColors = [];
		let colorIndex = 0;

		for(let i = 0; i < this.props.chartData.length; i++){
			chartColors.push(possibleColors[colorIndex]);
			
			colorIndex++;
			
			if(colorIndex >= possibleColors.length){
				colorIndex = 0;
			}
		}

		return chartColors;
	}

	parseScoreData = () => {
		console.log("in parseScoreData, this.props.chartData: ", this.props.chartData);

		
		let chartColors = this.getColors(0);

		let tempScoreData = {
			labels: this.props.chartData.map(data => data.platform),
			datasets: [
				{
					label: this.props.moduleName + " (Average Score)",
					data: this.props.chartData.map(data => data.averageScore),
					backgroundColor: chartColors
				}
			]
		};



		this.setState({
			scoreData: tempScoreData
		})
	}

	parseSessionLengthData = () => {
		
		let chartColors = this.getColors(1);

		let tempSessionLengthData = {
			labels: this.props.chartData.map(data => data.platform),
			datasets: [
				{
					label: this.props.moduleName + " (Average Session Length)",
					data: this.props.chartData.map(data => data.averageSessionLength),
					backgroundColor: chartColors
				}
			]
		};



		this.setState({
			sessionLengthData: tempSessionLengthData
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

		console.log("In ModuleChart, this.state.scoreData: ", this.state.scoreData, "this.state.sessionLengthData", this.state.sessionLengthData)
		
		let newChartData = this.props.chartData;

		//TODO: try to find a way to do this outside of the render() function
		if(!this.arraysEqual(newChartData, this.state.prevChartData)){
			this.parseScoreData();
			this.parseSessionLengthData();
			this.setState({
				prevChartData: this.props.chartData
			})
		}

		return(
			<div>
				<Row>
				<Col>
				<Bar 
					data={this.state.scoreData}
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

				</Col>
				
				<Col xs="auto">
					<div style={{borderLeft: "6px solid darkBlue", height: "100%", width:"1%"}}/>
				</Col>
				<Col>

				<Bar

					data={this.state.sessionLengthData}
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
				</Col>
			</Row>
			</div>
		)
	}


}