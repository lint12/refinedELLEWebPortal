import React from 'react';
import { Card, CardBody, Row, Col } from 'reactstrap';

const AccessDenied = (props) => {
    return (
        <div>
            <Card color="warning">
                <CardBody>
                    <Row>
                        <Col>
                            <img src={require('../Images/access-denied.png')}/>
                        </Col>
                        <Col>
                            <h3 style={{padding: "200px 0 0 100px"}}>{props.message}</h3>
                        </Col>
                    </Row>
                </CardBody>
            </Card> 
        </div>
    );
}
  
export default AccessDenied