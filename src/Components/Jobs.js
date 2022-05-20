import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { JObContext } from "../App";
import { Container, Row, Col, Button} from "react-bootstrap";
import { API_URL } from "../App";
import axios  from "axios";

function Jobs() {
  let context = useContext(JObContext);
  const { id } = useParams();
  //console.log(id);
  let job = context.data.filter((e) => {
    return e._id === id;
  });
  console.log(job);

  const handleReject = async(e) => {
      try {
        await axios.put(`${API_URL}/reject`, {id:e, jobId:id})
      } catch (error) {
          console.log(error);
      }
    }

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Admin view job by ID</h1>
      <Container fluid>
        <Row>
          <Col>Company Name</Col>
          <Col>{job[0]['company name']}</Col>
        </Row>
        <Row>
          <Col>Role Name</Col>
          <Col>{job[0]['role name']}</Col>
        </Row>
        <Row>
          <Col>Description</Col>
          <Col>{job[0].description}</Col>
        </Row>
        <Row>
          <Col>Applied</Col>
          <Col>
          {
              job[0].applicants.applied.map((e) => {
                  return <Row>
                      <Col>{e}</Col>
                      <Col><Button variant= "danger" onClick={handleReject(e)}>Reject</Button></Col>
                  </Row>
              })
          }
          </Col>
          
        </Row>
        <Row>
          <Col>Rejected</Col>
          <Col>
          {
              job[0].applicants.rejected.map((e) => {
                  return <Row>
                      <Col>{e}</Col>
                  </Row>
              })
          }
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Jobs;
