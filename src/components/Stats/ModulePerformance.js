import React, { Component } from 'react'
import { Row, Col, Table, Card, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { trackPromise } from 'react-promise-tracker';
import Spinner from '../Loading/Spinner';
import { Bar } from 'react-chartjs-2'; 
import axios from 'axios';   

class ModulePerformance extends Component {
	constructor(props){
		super(props);

		this.state = {
            modules: null,
            modalOpen: false,
            termStats: []
        }
 
    }

    componentDidMount() {
        this.getModuleStats();
    }

    getModuleStats = () => {
        let header = {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        };

        trackPromise(
            axios.get(this.props.serviceIP + '/allmodulestats', header)
            .then(res => {
                console.log("module stats: ", res.data); 
                this.setState({ modules: res.data }); 
            }).catch(error => {
                console.log("module stats error: ", error.message); 
            })
        );
    }

    renderModulesChart = () => {
        return (
            this.state.modules.length !== 0 ?
                <Table className="statsTable"> 
                    <thead>
                        <tr>
                            <th>Module ID</th>
                            <th>Module Name</th>
                            <th>Average Score</th>
                            <th>Average Duration</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                        {this.state.modules.map((module, i) => {
                            return (
                                <tr key={i}>
                                    <td>{module.moduleID}</td>
                                    <td>{module.name}</td>
                                    <td>{(module.averageScore).toFixed(2)}</td>
                                    <td>{module.averageSessionLength}</td>
                                    <td>
                                        <Button 
                                            style={{backgroundColor: "transparent", border: "none", padding: "0px"}}
                                            onClick={() => this.toggleModal(module.moduleID)}
                                        >
                                            <img 
                                                src={require('../../Images/moreReg.png')}
                                                alt="Icon made by xnimrodx from www.flaticon.com" 
                                                name="more"
                                                style={{width: '20px', height: '20px'}}
                                            />
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            : <p style={{margin: "10px 15px"}}>There are currently no records.</p>
        )
    }

    toggleModal = (id) => {
        this.setState({ modalOpen: !this.state.modalOpen });

        if (this.state.modalOpen === false)
            this.getTermStats(id); 
    }

    getTermStats = (id) => {
        let header = {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
            params: { moduleID: id }
        }

        axios.get(this.props.serviceIP + '/termsperformance', header)
        .then(res => {
            console.log(res.data); 
            if (res.data.Message)
                this.setState({ termStats: [] })
            else 
                this.setState({ termStats: res.data })
        }).catch(error => {
            console.log(error.response); 
        })
    }

    renderChart = () => {
        let terms = Object.entries(this.state.termStats).map(([i, term]) => {
            return( {front: term.front, percentage: term.correctness*100} )
        }); 

        console.log("Terms: ", terms); 

        let performanceData = {
            labels: terms.map(term => term.front),
            datasets: [
            {
                label: 'Correctness (%)',
                data: terms.map(term => term.percentage),
                backgroundColor: ['#abc9cd', '#658e93', '#7abe80']
            }
            ]
        };

        return (
            this.state.termStats.length !== 0 ?
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
            : <p>No records found.</p>
        )
    }

	render() { 
        return (
            <Row>
                <Col>
                    <Card style={{backgroundColor: "#04354b", color: "aqua", overflow: "scroll", height: "45vh", borderTopLeftRadius: "0px"}}>
                        {this.state.modules
                        ? this.renderModulesChart() 
                        : <Spinner chart="performance"/>}
                    </Card>

                    <Modal isOpen={this.state.modalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Terms Performance</ModalHeader>
                        <ModalBody>
                            {this.renderChart()}
                        </ModalBody>
                    </Modal>
                </Col>
            </Row>
        );
    }
}

export default ModulePerformance