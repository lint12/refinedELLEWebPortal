import Axios from 'axios';
import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import '../../stylesheets/superadmin.css'
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; 

class PlatformStats extends Component {
	constructor(props){
		super(props);

		this.state = {
            duration: {},
            frequency: {},
            performance: {}
        }

 
    }

    componentDidMount() {
        let header = {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        };

        axios.get(this.props.serviceIP + '/getallsessions', header)
        .then(res => {
            console.log(res.data); 

        }).catch(error => {
            console.log(error.response); 
        })
    }

    renderPerformanceChart = () => {
        let chartColors=['#abc9cd', '#658e93', '#7abe80']

        let performanceData = {
            labels: ["Mobile", "PC", "VR"],
            datasets: [
            {
                label: 'Average Score (%)',
                data: [20,55,60],
                backgroundColor: chartColors
            }
            ]
        };
        
        return (
            <Bar 
                data={performanceData}
                options={
                    { 
                        scales: {
                            yAxes: [{
                                ticks: {                  
                                    beginAtZero: true, 
                                    min: 0,
                                    max: 100,
                                    fontColor: 'white'
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    fontColor: 'white'
                                }
                            }]
                        },
                        legend: {labels: { fontColor: 'white' } }
                    }     
                }
            />
        )
    }

	render() { 
        return (
            <>
                <Col className="Platform Left Column" xs="4">
                    <Row>
                        <div class="suCard">
                            Average Platform Duration
                            <li>Mobile: </li>
                            <li>PC: </li>
                            <li>VR: </li>
                        </div>
                    </Row>
                    <br />
                    <Row>
                        <div class="suCard">
                            Average Platform Frequency 
                            <li>Mobile: </li>
                            <li>PC: </li>
                            <li>VR: </li>
                        </div>
                    </Row>
                </Col>

                <Col className="Platform Right Column">
                    <div class="suCard">
                        Average Platform Performance
                        {this.renderPerformanceChart()}
                    </div>
                </Col>
            </>
        );
    }
}

export default PlatformStats