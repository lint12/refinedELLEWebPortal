import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import '../../stylesheets/superadmin.css'
import PlatformStats from '../Stats/PlatformStats';
import ModuleStats from '../Stats/ModuleStats';
import TagStats from '../Stats/TagStats';
import Password from './Password';

export default class SuperAdminView extends Component {
    constructor() {
        super();
    }

    render() { 
        return (     
            <div className="suContainer">
                <br />
                <Row>
                    <Col className="Left Column" xs="3">
                        <Row>
                            <Col>
                                <div className="greetingsTag">
                                    Welcome back {this.props.username}!
                                    <Password serviceIP={this.props.serviceIP} userType="su" email={this.props.email} editEmail={this.props.editEmail}/>
                                </div>
                            </Col>
                        </Row>
                        <br />
                        <Row>
                            <TagStats serviceIP={this.props.serviceIP}/>
                        </Row>
                    </Col>
                
                    <Col className="Right Column">
                        <Row className="Top Row">
                            <PlatformStats serviceIP={this.props.serviceIP}/>
                        </Row>
                        <br />
                        <Row className="Bottom Row">
                            <ModuleStats serviceIP={this.props.serviceIP}/>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}