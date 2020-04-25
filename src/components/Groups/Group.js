import React from 'react'


const Group = (props) => {
  const { groups } = props;
  return (
    <tr>
			<td>{groups.id}</td>
			<td>{groups.name}</td>
    </tr>
  );
};

export default Group
