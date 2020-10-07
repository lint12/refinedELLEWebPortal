import React from 'react'
import { Card, Table } from 'reactstrap';

const PlatformSession = (props) => {
    const { sessions } = props;
    
    const convertTimetoDecimal = (time) => {
        let hoursMinutes = time.split(/[.:]/);
        let hours = parseInt(hoursMinutes[0], 10);
        let minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes / 60;
    }

    return (
        <Card style={{border: "none", height: "56vh", overflow: "scroll"}}>
            <Table hover className="minimalisticTable">
            <thead>
                <tr>
                <th>SessionID</th>
                <th>Date</th>
                <th>UserID</th>
                <th>Score</th>
                <th>Duration</th>
                <th>ModuleID</th>
                <th>Module Name</th>
                <th>Platform</th>
                </tr>
            </thead>
            <tbody>
                {sessions.map(
                    (session, i) => {
                        return (
                        <tr key={i}>
                            <td>{session.sessionID}</td>
                            <td>{session.sessionDate}</td>
                            <td>{session.userID}</td>
                            <td>{session.playerScore}</td>
                            <td>
                                {session.endTime !== null && session.startTime !== null ?
                                    (convertTimetoDecimal(session.endTime) - convertTimetoDecimal(session.startTime)).toFixed(2) + " hrs"
                                : "invalid values"}
                            </td>
                            <td>{session.moduleID}</td>
                            <td>{session.moduleName}</td>
                            <td>{session.platform}</td>
                        </tr>
                        )
                    }
                )}
            </tbody>
            </Table>
        </Card>
    )
}

export default PlatformSession