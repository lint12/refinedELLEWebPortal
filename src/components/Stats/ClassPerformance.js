import React, { Component } from 'react'
import { Card, Table, Row, Col } from 'reactstrap';
import { Bar } from 'react-chartjs-2'; 
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import axios from 'axios';   

class ClassPerformance extends Component {
	constructor(props){
		super(props);

		this.state = {
            termStats: [],
            threshold: 50
        }
 
    }

    componentDidMount() {
        this.getTermsPerformance();
    }

    getTermsPerformance = () => {
        let header = {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            params: { groupID: this.props.groupID }
        }

        axios.get(this.props.serviceIP + '/termsperformance', header)
        .then(res => {
            console.log(res.data); 
            this.setState({ termStats: res.data })
        }).catch(error => {
            console.log(error.response); 
        })
    }

    renderCharts = () => {
        return (
            <Row style={{margin: "0px"}}>
                <Col xs="7" style={{padding: "0px"}}>
                    {this.renderTable()}
                </Col>
                <Col xs="5" style={{padding: "0px"}}>
                    <Card style={{height: "35vh", borderRadius: "0px", borderRightStyle: "hidden"}}>
                        {this.renderBarChart()}
                        <Slider
                            value={this.state.threshold}
                            orientation="horizontal"
                            style={{width: "80%", margin: "5px 30px"}}
                            onChange={this.changeThreshold}
                        />
                        <p style={{textAlign: "end", padding: "0px 30px", fontSize: "10px"}}>Threshold: {this.state.threshold}</p>
                    </Card>
                </Col>
            </Row>
        )
    }

    renderTable = () => {
        return (
            <Table className="termStatsTable"> 
                <thead>
                    <tr>
                        <th>Term ID</th>
                        <th>Front</th>
                        <th>Back</th>
                        <th>Correctness</th>
                        <th>No. of Practice</th>
                        <th>Relevant Modules</th>
                    </tr>
                </thead>
                <tbody> 
                    {Object.entries(this.state.termStats).map(([i, term]) => {
                        return (
                            <tr key={i}>
                                <td>{i}</td>
                                <td>{term.front}</td>
                                <td>{term.back}</td>
                                <td>{term.correctness * 100}%</td>
                                <td>{term.count}</td>
                                <td>{Object.values(term.modules).map(module => module)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        )
    }

    renderBarChart = () => {
        let filteredTerms = Object.entries(this.state.termStats).map(([i, term]) => 
            term.correctness*100 >= this.state.threshold ? {front: term.front, percentage: term.correctness*100} : null
        ); 

        let percentage = (filteredTerms.length/Object.keys(this.state.termStats).length) * 100; 

        console.log("Terms with this threshold or greater: ", filteredTerms); 

        let performanceData = {
            labels: filteredTerms.map(term => term.front),
            datasets: [
            {
                label: 'Correctness (%)',
                data: filteredTerms.map(term => term.percentage),
                backgroundColor: ['#abc9cd', '#658e93', '#7abe80']
            }
            ]
        };

        return (
            filteredTerms.length !== 0 ? 
            <>
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
                                        fontColor: 'black'
                                    }
                                }],
                                xAxes: [{
                                    ticks: {
                                        fontColor: 'black'
                                    }
                                }]
                            },
                            legend: {labels: { fontColor: 'black' } }
                        }     
                    }
                />
                <p style={{textAlign: "center", fontSize: "14px"}}>{percentage}% of the terms meet the threshold</p>
            </>
            :
            <p style={{textAlign: "center"}}>No terms match this threshold.</p>
        )
    }

    changeThreshold = (value) => {
        this.setState({
          threshold: value
        })
    }

	render() { 
        return (
            this.state.termStats.Message ? <p style={{margin: "10px 15px"}}>No records found.</p> : this.renderCharts()
        );
    }
}

export default ClassPerformance