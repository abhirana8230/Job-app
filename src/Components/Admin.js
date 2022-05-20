import React, { useContext } from "react";
import { JObContext } from "../App";
import Table from "react-bootstrap/Table";
import { NavLink } from "react-router-dom";

function Admin() {
  let context = useContext(JObContext);
  console.log(context.data);

  return (
    <>
    <h1 style={{textAlign:'center'}}>Admin Page</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Company Name</th>
            <th>Role Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {context.data.map((e, index) => {
              const url = (e._id);
            return (
              <tr key={e._id}>
                <td>
                    <NavLink to = {url}>{index+1}</NavLink>
                </td>
                <td>{e['company name']}</td>
                <td>{e['role name']}</td>
                <td>{e.description}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default Admin;
