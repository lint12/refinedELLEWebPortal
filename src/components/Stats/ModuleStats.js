import React, { Component } from 'react'
import { Row, Col } from 'reactstrap';
import '../../stylesheets/superadmin.css'

class ModuleStats extends Component {
	constructor(props){
		super(props);

		this.state = {
        }

 
    }

	render() { 
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
                    </div>
                </Col>
            </>
        );
    }
}

export default ModuleStats