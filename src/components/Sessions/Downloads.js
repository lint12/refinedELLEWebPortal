import React, { useState } from 'react';
import { Button, Col, Tooltip } from 'reactstrap'; 
import axios from 'axios';

const Downloads = (props) => {
    const [sessionTooltipOpen, setSessionTooltipOpen] = useState(false);
    const [loggedAnsTooltipOpen, setLoggedAnsTooltipOpen] = useState(false);

    const toggleSessionTooltip = () => setSessionTooltipOpen(!sessionTooltipOpen);
    const toggleLoggedAnsTooltip = () => setLoggedAnsTooltipOpen(!loggedAnsTooltipOpen);

    const downloadSessions = () => {
        axios.get(props.serviceIP + '/getsessioncsv', {
          headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => {
          console.log(res.data);
    
        }).catch(function (error) {
          console.log(error);
        });
    }
    
    const downloadLoggedAnswers = () => {
        axios.get(props.serviceIP + '/getloggedanswercsv', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }
        }).then(res => {
            console.log(res.data);
    
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <Col style={{display: "flex", justifyContent: "flex-end"}}>
            <Button 
                id="downloadSessions"
                href={props.serviceIP + "/getsessioncsv"}
                download="sessions.csv"
                style={{backgroundColor: "#37f0f9", color: "black", border: "none", marginRight: "15px", 
                    display: "grid", fontSize: "10px", fontWeight: "700", padding: "5px 2px 0 2px"}} 
                onClick={() => downloadSessions()}
            >
                <img style={{width: "25px", height: "25px", display:"flex", justifySelf: "center"}} 
                    src={require('../../Images/csv.png')} alt="csv icon" 
                />
                Sessions
            </Button>

            <Button 
                id="downloadLoggedAnswers"
                href={props.serviceIP + "/getloggedanswercsv"}
                download="logged_answers.csv"
                style={{backgroundColor: "#37f0f9", color: "black", border: "none", marginRight: "15px", 
                    display: "grid", fontSize: "10px", fontWeight: "700", padding: "2px 2px 0 2px"}} 
                onClick={() => downloadLoggedAnswers()}
            >
                <img style={{width: "30px", height: "30px", display:"flex", justifySelf: "center"}} 
                    src={require('../../Images/log.png')} alt="log icon" 
                />
                Answers
            </Button>

            <Tooltip placement="top" isOpen={sessionTooltipOpen} target="downloadSessions" toggle={() => toggleSessionTooltip()}>
                Download Sessions 
            </Tooltip>

            <Tooltip placement="top" isOpen={loggedAnsTooltipOpen} target="downloadLoggedAnswers" toggle={() => toggleLoggedAnsTooltip()}>
                Download Logged Answers
            </Tooltip>
        </Col>
    );
}

export default Downloads