import React, { Component } from 'react'
import User from './../UserList/User';
import { Table } from 'reactstrap';

const styles = {
    transition: "all .5s ease-out"
}

class Class extends Component {
	constructor(props){
		super(props);

		this.state = {
            search: "",
            width: "0px",
            marginLeft: "160px",
            close: true
        }

        this.inputRef = React.createRef();
    }
    
    onExpand = () => {
        this.setState({ 
            width: this.state.width === "0px" ? "160px" : "0px",
            marginLeft: this.state.marginLeft === "160px" ? "0px" : "160px",
            close: !this.state.close //this will take in affect after onExpand() has completed 
        });

        //if the current state of the button is close then that means the button has been toggled to open so focus the input 
        if (this.state.close)
            this.inputRef.current.focus();
    }

    updateSearch(e) {
        this.setState({ search: e.target.value.substr(0,20) });
    }

	render() {
        let filteredStudent = this.props.group.group_users.filter(
            (student) => { 
                return (student.username.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1);
            }
        );

        filteredStudent.filter((student) => student.accessLevel === this.props.currentGroup);

	    return (
        <Table hover className="userListTable">
          <thead>
            <tr>
                <th colSpan="2" style={{borderTopLeftRadius: "8px", backgroundColor: this.props.groupColor}}>{this.props.group.groupName}</th>
                <th style={{borderTopRightRadius: "8px", backgroundColor: this.props.groupColor}}>
                    {this.props.group.group_users.length !== 0
                    ?
                    <>
                    <button
                        size="sm"
                        style={{...styles, marginLeft: this.state.marginLeft, backgroundColor: "transparent", borderStyle: "hidden", outline: "none"}}
                        onClick={() => this.onExpand()}
                    >
                        <img 
                            src={require('../../Images/search.png')} 
                            alt="Icon made by Freepik from www.flaticon.com" 
                            style={{width: '15px', height: '15px'}}
                        />
                    </button>

                    <input 
                        placeholder="Search for a student"
                        style={{
                            ...styles, 
                            width: this.state.width, 
                            borderStyle: "hidden hidden solid",
                            padding: "0px",
                            background: "transparent",
                            outline: "none"
                        }}
                        value={this.state.search} 
                        onChange={this.updateSearch.bind(this)}
                        ref={this.inputRef}
                        onBlur={() => this.onExpand()}
                    />
                    </>
                    : null}
                </th>
            </tr>
          </thead>

          <tbody> 
            {this.props.group.group_users.length !== 0 
            ?
            <>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Permission</th>
                </tr>
                {filteredStudent.length !== 0 
                ? 
                filteredStudent.map((user) => {
                    return (
                        <User key={user.userID} user={user} type="pf" />
                    )
                })
                :
                <tr>
                    <td>
                        {this.state.search} cannot be found in this class.
                    </td> 
                    <td></td>
                    <td></td>
                </tr>}
            </>
            :
            <tr>
                <td>
                    You currently have no {this.props.currentGroup === "st" ? "students" : "TAs"}
                </td> 
                <td colSpan="2"></td>
            </tr>
            }
          </tbody>
        </Table>
	    )
	}
}

export default Class