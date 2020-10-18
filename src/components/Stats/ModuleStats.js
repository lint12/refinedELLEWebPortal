import React, { Component } from 'react'
import { Row, Col, Table, Card } from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2'; 
import '../../stylesheets/superadmin.css'
import { trackPromise } from 'react-promise-tracker';
import Wave from '../Loading/Wave'; 
import axios from 'axios';   
import languageCodes from '../../languageCodes3.json';

class ModuleStats extends Component {
	constructor(props){
		super(props);

		this.state = {
            modules: [],
            languages: {},
        }
 
    }

    componentDidMount() {
        this.getModuleStats();
        this.getLanguageStats(); 
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
                console.log("module stats error: ", error); 
            })
        );
    }

    getLanguageStats = () => {
        let header = {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        };

        trackPromise(
            axios.get(this.props.serviceIP + '/languagestats', header)
            .then(res => {
                console.log("language stats: ", res.data); 
                this.setState({ languages: res.data }); 
            }).catch(error => {
                console.log("language stats error: ", error); 
            })
        );
    }

    renderModulesChart = () => {
        return (
            <Card style={{overflow: "scroll", height: "25vh", backgroundColor: "transparent", border: "none"}}>
                <Table className="statsTable"> 
                    <thead>
                        <tr>
                            <th>Module ID</th>
                            <th>Module Name</th>
                            <th>Average Score</th>
                            <th>Average Duration</th>
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
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

    renderLanguageChart = () => {
        let languageData = {
            labels: Object.keys(this.state.languages).map(item => languageCodes[item]),
            datasets: [
                {
                    label: 'platforms',
                    data: Object.keys(this.state.languages).map(item => (this.state.languages[item] * 100).toFixed(2)),
                    backgroundColor: ['#96384e', '#eda48e', '#eed284', '#CD5C5C', '#F08080', '#E9967A', '#FA8072', '#20B2AA', '#2F4F4F', '#008080', '#008B8B', '#4682B4', '#6495ED', '#00BFFF', '#1E90FF', '#8B008B', '#9400D3', '#9932CC', '#BA55D3', '#C71585', '#DB7093', '#FF1493', '#FF69B4']
                }
            ]
        };

        return (
            <Card style={{overflow: "scroll", height: "20vh", width: "20vh", margin: "20px 0px 0px 35px",
                          backgroundColor: "transparent", border: "none"}}>
                <Pie
                    data={languageData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        cutoutPercentage: 50,
                        legend: {
                            // position: 'right',
                            // align: "start",
                            // labels: {
                            //     fontColor: 'white'
                            // }
                            display: false
                        }
                    }}
                />
            </Card>
        )



        // return (
        //     <Card style={{overflow: "scroll", height: "25vh", backgroundColor: "transparent", border: "none"}}>
        //         <Table className="statsTable"> 
        //             <tbody> 
        //                 {Object.keys(this.state.languages).map((item, i) => {
        //                     return (
        //                         <tr key={i}>
        //                             <td style={{fontSize: "12px"}}>
        //                                 {languageCodes[item]}
        //                             </td>
        //                             <td style={{textAlign: "end", fontSize: "12px"}}>
        //                                 {(this.state.languages[item] * 100).toFixed(2) + "%"}
        //                             </td>
        //                         </tr>
        //                     )
        //                 })}
        //             </tbody>
        //         </Table>
        //     </Card>
        // )
    }

	render() { 
        console.log("language state: ", Object.keys(this.state.languages).length); 
        return (
            <>
                <Col className="Module Left Columns" xs="8" style={{paddingLeft: "0px"}}>
                    <div className="suCardGreen">
                        Module Performance
                        {this.state.modules.length !== 0 ?
                        this.renderModulesChart() : <Wave chart="modules"/>}
                    </div>
                </Col>
                <Col className="Module Right Columns" style={{paddingLeft: "0px"}}>
                    <div className="suCardBlue">
                        Module Languages
                        {Object.keys(this.state.languages).length !== 0 ?
                        this.renderLanguageChart() : <Wave chart="language"/>}
                    </div>
                </Col>
            </>
        );
    }
}

export default ModuleStats