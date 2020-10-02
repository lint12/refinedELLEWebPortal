import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Table, Card, CardBody } from 'reactstrap'
import axios from 'axios';

class User extends Component {
	constructor(props){
		super(props);

		this.state = {
			detailModalOpen: false 
		}
	}

	toggleDetailModal = () => {
		this.setState({ detailModalOpen: !this.state.detailModalOpen })
	}

	generateNewCode = (id) => {
		let header = {
		  headers: { 'Authorization': 'Bearer ' + localStorage.getItem('jwt') },
		  params: {groupID: id}
		}
	
		axios.get(this.props.serviceIP + '/generategroupcode', header)
		.then(res => {
		  console.log("NEW GROUP CODE: ", res.data);
		  this.props.getUsers(); 
		}).catch(error => {
		  console.log("ERROR in generating new group code: ", error);
		})
	}

	render() {
	    return (
			<>
			<tr>
				<td>{this.props.user.userID}</td>
				<td>{this.props.user.username}</td>
				<td>{this.props.type === "su" ? this.props.user.permissionGroup : this.props.user.accessLevel}</td>
				{this.props.group === "pf" 
				? <td>
					<Button 
						style={{backgroundColor: "transparent", border: "none", padding: "0px"}}
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
				<ModalBody style={{paddingBottom: "10px"}}>
					{this.props.group === 'pf' 
					? this.props.user.groups.length !== 0 ?
					<>
					<Card style={{height: "40vh", overflow: "scroll", borderStyle: "none"}}>
						<Table className="professorDetailsTable">
							<thead>
								<tr>
									<th>ID</th>
									<th>Name</th>
									<th>Code</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{this.props.user.groups.map(
									(group, i) => {
										return (
											<tr key={i}>
												<td>{group.groupID}</td>
												<td>{group.groupName}</td>
												<td>{group.groupCode}</td>
												<td>
													<img 
														src={require('../../Images/shuffle.png')}
														alt="Icon made by Freepik from www.flaticon.com" 
														name="change"
														style={{width: '15px', height: '15px', cursor: "pointer"}}
														onClick={() => this.generateNewCode(group.groupID)}
													/>
												</td>
											</tr>
										)
									}
								)}
							</tbody>
						</Table>
					  </Card>
					  	<p style={{margin: "10px 0 0 0", float: "right", fontSize: "12px"}}>Use {' '} 													
							<img 
								src={require('../../Images/shuffle.png')}
								alt="Icon made by Freepik from www.flaticon.com" 
								name="change"
								style={{width: '10px', height: '10px'}}
							/>
							{' '} to generate a new class code. 
						</p>
					  </>
					: 
					  <Card style={{alignItems: "center", borderStyle: "none"}}>
					  	{this.props.user.username} currently does not have any classes.
					  </Card>
					: null }
				</ModalBody>
			</Modal>
			</>
	    )
	}
}

export default User
