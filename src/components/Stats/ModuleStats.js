import React, { Component } from 'react'
import { Row, Col, Table, Card } from 'reactstrap';
import '../../stylesheets/superadmin.css'
import { trackPromise } from 'react-promise-tracker';
import Wave from '../Loading/Wave'; 
import axios from 'axios';

class ModuleStats extends Component {
	constructor(props){
		super(props);

		this.state = {
            modules: [],
            languages: {}
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

    renderLanguageChart = () => {
        return (
            <Card style={{overflow: "scroll", height: "25vh", backgroundColor: "transparent", border: "none"}}>
                <Table className="statsTable"> 
                    <tbody> 
                        {Object.keys(this.state.languages).map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td>
                                        {item}
                                    </td>
                                    <td style={{textAlign: "end"}}>
                                        {(this.state.languages[item] * 100).toFixed(2) + "%"}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Card>
        )
    }

	render() { 
        console.log("language state: ", Object.keys(this.state.languages).length); 
        return (
            <>
                <Col className="Module Left Columns" xs="8" style={{paddingLeft: "0px"}}>
                    <div className="suCardGreen">
                        Module Performance
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