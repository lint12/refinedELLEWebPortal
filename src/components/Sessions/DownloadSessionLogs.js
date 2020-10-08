import React, { useState } from 'react';
import { Button, Tooltip } from 'reactstrap'; 
import axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import DownloadSpinner from '../Loading/DownloadSpinner';

const DownloadSessionLogs = (props) => {   
    const [sessionTooltipOpen, setSessionTooltipOpen] = useState(false);
    const toggleSessionTooltip = () => setSessionTooltipOpen(!sessionTooltipOpen);

    const downloadSessions = () => {
        trackPromise(
            axios.get(props.serviceIP + '/getsessioncsv', {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') }})
            .then(res => {
                console.log(res.data);  
            }).catch(function (error) {
            console.log(error);
            }), 'sessionBtn'
        );
    }

    return (
        <>
            <Button 
                id="downloadSessions"
                href={props.serviceIP + "/getsessioncsv"}
                download="sessions.csv"
                style={{backgroundColor: "#37f0f9", color: "black", border: "none", marginRight: "15px", 
                    display: "grid", fontSize: "10px", fontWeight: "700", padding: "2px 2px 0 2px"}} 
                onClick={() => downloadSessions()}
            >
                <DownloadSpinner area="sessionBtn"/>

            </Button>

            <Tooltip placement="top" isOpen={sessionTooltipOpen} target="downloadSessions" toggle={() => toggleSessionTooltip()}>
                Download Sessions 
            </Tooltip>
        </>
    );
}

export default DownloadSessionLogs