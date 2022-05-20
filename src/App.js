import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import axios from "axios";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Admin from './Components/Admin';
import Jobs from './Components/Jobs';
import CreateJob from './Components/CreateJob';
import CreateStudent from './Components/CreateStudent';
import Student from './Components/Students';

export const API_URL = "http://localhost:4000";
export const JObContext = React.createContext();

function App() {

  let[data,setData] = useState([]);

  const getData = async () => {
    let dataObtain = await axios.get(`${API_URL}/jobs`);
    //console.log(dataObtain.data.data);
    setData(dataObtain.data.data);
  }

  useEffect(() => {
    getData();
  },[]);

  return (
    <>
    <Router>
      <JObContext.Provider value={{data}}>
        <Routes>
          <Route path="/admin" element={<Admin/>} /> 
          <Route path="/admin/:id" element={<Jobs/>} />
          <Route path="/create-job" element={<CreateJob/>} />
          <Route path="/create-student" element={<CreateStudent/>} />
          <Route path="/:id" element={<Student/>} /> 
          <Route path="/" element={<Student/>} /> 
        </Routes>
      </JObContext.Provider>
    </Router>
    </>
  )
}

export default App;
