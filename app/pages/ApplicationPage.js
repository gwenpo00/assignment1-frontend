import React, { useState, useEffect } from "react";
import Page from "./Page";
import Input from "@mui/joy/Input";
import axios from "axios";
import Button from "@mui/joy/Button";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { FormControl, InputLabel, Typography } from "@mui/material";
import { Autocomplete } from "@mui/joy";
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function ApplicationPage() {
  const navigate = useNavigate();

  const [newAcronym, setNewAcronym] = useState("");
  const [newAppRNo, setNewAppRNo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const [newEditOpenTaskPermit, setNewEditOpenTaskPermit] = useState([]);
  const [newEditToDoTaskPermit, setNewEditToDoTaskPermit] = useState([]);
  const [newEditDoingTaskPermit, setNewEditDoingTaskPermit] = useState([]);
  const [newEditDoneTaskPermit, setNewEditDoneTaskPermit] = useState([]);
  const [newCreateTaskPermit, setCreateTaskPermit] = useState([]);

  const [groupsNames, setAllGroupsNames] = useState([]);

  useEffect(() => {
    console.log("Loading groups...");
    async function getAllGroups() {
      try {
        const response = await axios.get("http://localhost:8080/groups/see");
        if (response.data && response.data.success === true) {
          setAllGroupsNames(response.data.results);
          console.log(response.data.results);
          console.log("loaded groups!");
        } else {
          console.log(response);
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        console.log(error);
        console.log("cant load groups!");
      }
    }
    getAllGroups();
  }, []);

  async function handleAddApp(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/app/add", {
        newAcronym,
        newAppRNo,
        newDescription,
        newStartDate,
        newEndDate,
        newCreateTaskPermit,
        newEditOpenTaskPermit,
        newEditToDoTaskPermit,
        newEditDoingTaskPermit,
        newEditDoneTaskPermit,
      });

      if (response.data) {
        navigate("/");
        toast.success("Application created!", {
          autoClose: 700,
        });
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (error.response.data.message.includes("not authorised")) {
        navigate("/");
        toast.error("You are not authorised!", {
          autoClose: 700,
        });
      }
      //   console.log(newUserGroup);
      toast.error("Failed to add app!", {
        autoClose: 700,
      });
      console.log("Failed to add app!");
      console.log(error);
    }
  }

  return (
    <Page>
      <h3>
        <b>Create Application</b>
      </h3>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h5 style={{ alignSelf: "flex-start" }}>App Details</h5>
        <h5 style={{ alignSelf: "centre" }}>Permissions</h5>
      </div>
      <form
        style={{ display: "flex", flexDirection: "row" }}
        onSubmit={handleAddApp}
      >
        <div className="form-group" style={{ width: "50%" }}>
          <div style={{ width: "100%" }}>
            <label>Acronym:</label>
            <Input
              name="newAcronym"
              style={{ width: "70%", marginBottom: "10px" }}
              onChange={(e) => setNewAcronym(e.target.value)}
            ></Input>
            <label>App RNo.</label>
            <Input
              name="newAppRNo"
              style={{ width: "70%", marginBottom: "10px" }}
              onChange={(e) => setNewAppRNo(e.target.value)}
            ></Input>
            <label>Description:</label>
            <Input
              name="newDescription"
              style={{ width: "70%", marginBottom: "10px" }}
              onChange={(e) => setNewDescription(e.target.value)}
            ></Input>
            <label>Start Date:</label>
            <Input
              name="newStartDate"
              type="date"
              style={{ width: "70%", marginBottom: "10px" }}
              onChange={(e) => setNewStartDate(e.target.value)}
            ></Input>
            <label>End Date:</label>
            <Input
              name="newEndDate"
              type="date"
              style={{ width: "70%", marginBottom: "10px" }}
              onChange={(e) => setNewEndDate(e.target.value)}
            ></Input>
          </div>
        </div>

        <div className="form-group" style={{ width: "50%" }}>
          <div style={{ width: "100%" }}>
            <label>Create Tasks:</label>
            <Autocomplete
              multiple
              style={{ width: "70%", marginBottom: "10px" }}
              options={groupsNames.map((group) => group.groupname)}
              getOptionLabel={(option) => option}
              name="newCreateTaskPermit"
              onChange={(event, newValue) => setCreateTaskPermit(newValue)}
            ></Autocomplete>
            <label>Edit Open Tasks</label>
            <Autocomplete
              multiple
              style={{ width: "70%", marginBottom: "10px" }}
              options={groupsNames.map((group) => group.groupname)}
              getOptionLabel={(option) => option}
              name="newEditOpenTaskPermit"
              onChange={(event, newValue) => setNewEditOpenTaskPermit(newValue)}
            ></Autocomplete>{" "}
            <label>Edit To-Do Tasks:</label>
            <Autocomplete
              multiple
              style={{ width: "70%", marginBottom: "10px" }}
              options={groupsNames.map((group) => group.groupname)}
              getOptionLabel={(option) => option}
              name="newEditToDoTaskPermit"
              onChange={(event, newValue) => setNewEditToDoTaskPermit(newValue)}
            ></Autocomplete>{" "}
            <label>Edit Doing Tasks:</label>
            <Autocomplete
              multiple
              style={{ width: "70%", marginBottom: "10px" }}
              options={groupsNames.map((group) => group.groupname)}
              getOptionLabel={(option) => option}
              name="newEditDoingTaskPermit"
              onChange={(event, newValue) =>
                setNewEditDoingTaskPermit(newValue)
              }
            ></Autocomplete>{" "}
            <label>Edit Done Tasks:</label>
            <Autocomplete
              multiple
              style={{ width: "70%", marginBottom: "10px" }}
              options={groupsNames.map((group) => group.groupname)}
              getOptionLabel={(option) => option}
              name="newEditDoneTaskPermit"
              onChange={(event, newValue) => setNewEditDoneTaskPermit(newValue)}
            ></Autocomplete>{" "}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "centre",
              marginTop: "10px",
            }}
          >
            <Button type="submit">Add Application</Button>
          </div>
        </div>
      </form>
    </Page>
  );
}

export default ApplicationPage;

// import React, { useEffect, useContext, useState } from "react";
// import GlobalContext from "./GlobalContext";
// import axios from "axios";
// import Page from "./Page";
// import { toast } from "react-toastify";
// import Input from '@mui/joy/Input';
// import FormControl from '@mui/joy/FormControl';
// import InputLabel from '@mui/material/InputLabel';
// import Autocomplete from '@mui/joy/Autocomplete';

// function ApplicationPage() {
//   return (
//     <Page>
//       <h3>Create Application</h3>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <h5 style={{ alignSelf: "flex-start" }}>App Details</h5>
//         <h5 style={{ alignSelf: "flex-end" }}>Permissions</h5>
//       </div>
//       <form>
//         <FormControl fullWidth>
//           <InputLabel>Acronym:</InputLabel>
//           <Input placeholder="Type in here…" />
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>App RNo.:</InputLabel>
//           <Input placeholder="Type in here…" />
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Description:</InputLabel>
//           <Input placeholder="Type in here…" />
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>Start Date:</InputLabel>
//           <Input placeholder="Type in here…" />
//         </FormControl>
//         <FormControl fullWidth>
//           <InputLabel>End Date:</InputLabel>
//           <Input placeholder="Type in here…" />
//         </FormControl>

//         <div style={{ marginTop: '20px' }}>
//           {/* Permissions Section */}
//           <FormControl fullWidth>
//             <InputLabel>Create Tasks:</InputLabel>
//             <Autocomplete
//               multiple
//               options={[] /* Add your options here */}
//               freeSolo
//               renderInput={(params) => (
//                 <Input {...params} placeholder="Type in here…" />
//               )}
//             />
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Edit Open Tasks:</InputLabel>
//             <Autocomplete
//               multiple
//               options={[] /* Add your options here */}
//               freeSolo
//               renderInput={(params) => (
//                 <Input {...params} placeholder="Type in here…" />
//               )}
//             />
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Edit To-Do Tasks:</InputLabel>
//             <Autocomplete
//               multiple
//               options={[] /* Add your options here */}
//               freeSolo
//               renderInput={(params) => (
//                 <Input {...params} placeholder="Type in here…" />
//               )}
//             />
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Edit Doing Tasks:</InputLabel>
//             <Autocomplete
//               multiple
//               options={[] /* Add your options here */}
//               freeSolo
//               renderInput={(params) => (
//                 <Input {...params} placeholder="Type in here…" />
//               )}
//             />
//           </FormControl>
//           <FormControl fullWidth>
//             <InputLabel>Edit Done Tasks:</InputLabel>
//             <Autocomplete
//               multiple
//               options={[] /* Add your options here */}
//               freeSolo
//               renderInput={(params) => (
//                 <Input {...params} placeholder="Type in here…" />
//               )}
//             />
//           </FormControl>
//         </div>
//       </form>
//     </Page>
//   );
// }

// export default ApplicationPage;
