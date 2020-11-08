import React, { Component } from 'react'
import { Card, CardHeader, Collapse } from 'reactstrap';
import ClassPerformance from './ClassPerformance';

class TermPerformance extends Component {
	constructor(props){
		super(props);

		this.state = {
            collapseTab: -1
        }
 
    }

    toggleTab(e) {
        let event = e.target.dataset.event; 
    
        //if the accordion clicked on is equal to the current accordion that's open then close the current accordion,
        //else open the accordion you just clicked on 
        this.setState({ collapseTab: this.state.collapseTab === Number(event) ? -1 : Number(event) }) 
    }

	render() { 
        return (
            <Card style={{backgroundColor: "#04354b", color: "aqua", overflow: "scroll", height: "45vh", borderTopLeftRadius: "0px"}}>
                {this.props.classes.map((group, i) => {
                    return (
                        <Card key={i} style={{border: "none", color: "black", borderRadius: "0px"}}>
                            <CardHeader style={{backgroundColor: "#74b7bd", color: "white", borderRadius: "0px"}} onClick={e => this.toggleTab(e)} data-event={i}>
                                {group.groupName}
                            </CardHeader>
                            
                            <Collapse isOpen={this.state.collapseTab === i} style={{border: "none"}}>
                                <ClassPerformance serviceIP={this.props.serviceIP} groupID={group.groupID}/>
                            </Collapse>
                        </Card>
                    )
                })}
            </Card>
        );
    }
}

export default TermPerformance