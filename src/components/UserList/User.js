import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Table, Card, CardBody } from 'reactstrap'

class User extends Component {
	constructor(props){
		super(props);

		this.state = {
			user: this.props.user, 
			detailModalOpen: false 
		}
	}

	toggleDetailModal = () => {
		this.setState({ detailModalOpen: !this.state.detailModalOpen })
	}

	render() {
	    return (
			<>
			<tr>
				<td>{this.state.user.userID}</td>
				<td>{this.state.user.username}</td>
				<td>{this.props.type === "su" ? this.state.user.permissionGroup : this.state.user.accessLevel}</td>
				{this.props.group === "pf" 
				? <td>
					<Button 
						style={{backgroundColor: "aliceblue", width: "35px", height: "30px", padding: "0px"}}
						onClick={() => this.toggleDetailModal()}
					>
						<img 
							src={require('../../Images/more.png')} 
							alt="Icon made by xnimrodx from www.flaticon.com" 
							name="more"
							style={{width: '20px', height: '20px'}}
                        />
					</Button>
				  </td> 
				: null}
		    </tr>

			<Modal isOpen={this.state.detailModalOpen}> 
				<ModalHeader toggle={() => this.toggleDetailModal()}>Details</ModalHeader>
				<ModalBody style={{paddingBottom: "30px"}}>
					{this.props.group === 'pf' 
					? this.state.user.groups.length !== 0 ?
					<Card style={{height: "40vh", overflow: "scroll", borderStyle: "none"}}>
						<Table className="professorDetailsTable">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Code</th>
								</tr>
							</thead>
							<tbody>
								{this.state.user.groups.map(
									(group, i) => {
										return (
											<tr key={i}>
												<td>{group.groupID}</td>
												<td>{group.groupName}</td>
												<td>{group.groupCode}</td>
											</tr>
										)
									}
								)}
							</tbody>
						</Table>
					  </Card>
					: 
					  <Card style={{alignItems: "center", borderStyle: "none"}}>
					  	{this.state.user.username} currently does not have any classes.
					  </Card>
					: null }
				</ModalBody>
			</Modal>
			</>
	    )
	}
}

export default User
