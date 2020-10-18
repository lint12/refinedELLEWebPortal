import React, { Component } from 'react'
import { Row, Col, Card, Table } from 'reactstrap';
import '../../stylesheets/superadmin.css';
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import Wave from '../Loading/Wave'; 

class TagStats extends Component {
	constructor(props){
		super(props);

		this.state = {
            tags: {}
        }
 
    }

    componentDidMount() {
        this.getTagStats(); 
    }

    getTagStats = () => {
        let header = {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        };

        trackPromise(
            axios.get(this.props.serviceIP + '/tagcount', header)
            .then(res => {
                console.log("tag stats: ", res.data); 
                this.setState({ tags: res.data }); 
            }).catch(error => {
                console.log("tag stats error: ", error); 
            })
        );
    }

    renderTagStats = () => {
        return (
            <Card style={{overflow: "scroll", height: "60vh", backgroundColor: "transparent", border: "none"}}>
                <Table className="statsTable"> 
                    <tbody> 
                        {Object.keys(this.state.tags).map((item, i) => {
                            return (
                                <tr key={i}>
                                    <td style={{fontSize: "14px"}}>
                                        {item}
                                    </td>
                                    <td style={{textAlign: "end", fontSize: "14px"}}>
                                        {this.state.tags[item]}
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
        return (
            <>
                <Col>
                    <div className="suCardBlue">
                        Tags
                        {Object.keys(this.state.tags).length !== 0 ? 
                        this.renderTagStats() : <Wave chart="tag"/>}
                    </div>
                </Col>  
            </>
        );
    }
}

export default TagStats