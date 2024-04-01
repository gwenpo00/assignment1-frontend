import React, { useContext, useEffect, useState } from "react";
import GlobalContext from "./GlobalContext";
import Page from "./Page";
import Table from "@mui/joy/Table";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Input from "@mui/joy/Input";
import { toast } from "react-toastify";
import axios from "axios";
import Modal from "@mui/joy/Modal";
import Box from "@mui/material/Box";
import { Autocomplete } from "@mui/joy";
import ViewAppModal from "./ViewAppModal";
import Textarea from "@mui/joy/Textarea";


function About() {
  const { handleCookie, isProjectLead, setIsProjectLead } =
    useContext(GlobalContext);
  const [allApps, setAllApps] = useState([]);
  const [app_acronym, setAcronym] = useState("");
  const [app_rnumber, setAppRNo] = useState("");
  const [app_description, setDescription] = useState("");
  const [app_startdate, setStartDate] = useState("");
  const [app_enddate, setEndDate] = useState("");

  const [refreshApp, setRefreshApp] = useState(0);
  //refresh modal
  const [refreshSelectedApp, setRefreshSelectedApp] = useState(0);

  const [app_permit_create, setCreateTaskPermit] = useState([]);
  const [app_permit_open, setEditOpenTaskPermit] = useState([]);
  const [app_permit_todolist, setEditToDoTaskPermit] = useState([]);
  const [app_permit_doing, setEditDoingTaskPermit] = useState([]);
  const [app_permit_done, setEditDoneTaskPermit] = useState([]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%", // Adjust the width as needed
    maxWidth: "800px", // Set a maximum width if necessary
    maxHeight: "80%", // Set a maximum height if necessary
    overflowY: "auto", // Add a scrollbar if content exceeds the maximum height
    bgcolor: "background.paper",
    // border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  //modals stuff
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [appOpen, setAppOpen] = React.useState(false);
  const handleAppOpen = () => setAppOpen(true);
  const handleAppClose = () => setAppOpen(false);

  const navigate = useNavigate();

  //app stuff
  const [newAcronym, setNewAcronym] = useState("");
  const [newAppRNo, setNewAppRNo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStartDate, setNewStartDate] = useState("");
  const [newEndDate, setNewEndDate] = useState("");

  const [newEditOpenTaskPermit, setNewEditOpenTaskPermit] = useState([]);
  const [newEditToDoTaskPermit, setNewEditToDoTaskPermit] = useState([]);
  const [newEditDoingTaskPermit, setNewEditDoingTaskPermit] = useState([]);
  const [newEditDoneTaskPermit, setNewEditDoneTaskPermit] = useState([]);
  const [newCreateTaskPermit, setNewCreateTaskPermit] = useState([]);

  const [groupsNames, setAllGroupsNames] = useState([]);

  const [selectedApp, setSelectedApp] = useState([]);

  const handleViewApp = async (app_acronym) => {
    try {
      const response = await axios.get("http://localhost:8080/getapp", {
        params: { app_acronym },
      });
      if (response.data && response.data.success === true) {
        setSelectedApp(response.data.results);
        console.log(response.data.results);
        console.log("loaded app details!");
        setRefreshApp((prev) => prev + 1);
      } else {
        console.log(response);
        throw new Error("Internal Server Error");
      }
    } catch (error) {
      console.log(error);
      console.log("cant load app details!");
    }
  };

  useEffect(() => {
    console.log("Running useEffect to check if user is admin");
    async function checkGroup(groupname) {
      try {
        const response = await axios
          .post("http://localhost:8080/authorize", {
            groupname,
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        setIsProjectLead(response.data.success);
        console.log("set is project lead to true");
      } catch (error) {
        console.log(error);

        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkGroup("projectlead");
  }, []);

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
    const validAppAcronym = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(newAcronym);
    if (!validAppAcronym) {
      toast.error(
        "Application acronym should only contain letters and numbers, and no spaces or special characters.",
        {
          autoClose: 700,
        }
      );
    }

    const finalAppRNo = newAppRNo === "" ? 0 : parseInt(newAppRNo);
    if (
      finalAppRNo < 0 ||
      finalAppRNo > 100000 ||
      !Number.isInteger(finalAppRNo)
    ) {
      toast.error(
        "Application RNo. should be a positive integer less than 100000.",
        {
          autoClose: 700,
        }
      );
      return;
    }
    if (newDescription.length > 255) {
      toast.error("Description should be less than 255 characters.", {
        autoClose: 700,
      });
      return;
    }

    if (newEndDate == "" || newStartDate == "") {
      toast.error("Dates need to be filled up!", {
        autoClose: 700,
      });
      return;
    }

    if (newEditOpenTaskPermit == "" || newEditToDoTaskPermit == "" || newEditDoingTaskPermit == "" || newEditDoneTaskPermit == "" || newCreateTaskPermit == "") {
      toast.error("Please select a group for all permissions.", {
        autoClose: 700,
      });
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/app/add", {
        newAcronym,
        newAppRNo: finalAppRNo,
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
        // navigate("/");
        setRefreshApp((prev) => prev + 1);
        handleClose();
        toast.success("Application created!", {
          autoClose: 700,
        });

      } else {
        toast.error(response.data.message, {
          autoClose: 700,
        });
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

  useEffect(() => {
    console.log("Loading apps...");
    async function getAllApps() {
      try {
        const response = await axios.get("http://localhost:8080/app/all");
        if (response.data && response.data.success === true) {
          setAllApps(response.data.results);
          console.log(response.data.results);
          console.log("loaded apps!");
        } else {
          console.log(response);
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        console.log(error);
        console.log("cannot");
      }
    }
    getAllApps();
  }, [refreshApp]);

  // async function goToAppPage(e) {
  //   e.preventDefault();
  //   console.log("go to app page");
  //   navigate("/app/add");
  // }
  return (
    <Page title="TMS">
      <h2>Applications</h2>
      {isProjectLead ? (
        <Button
          onClick={handleOpen}
          startDecorator={<Add />}
          style={{
            float: "right",
          }}
        >
          Add Application
        </Button>
      ) : null}

      <Table aria-label="basic table">
        <thead>
          <tr>
            <th
              style={{
                width: "12%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Acronym
            </th>
            <th
              style={{
                width: "12%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Start Date
            </th>
            <th
              style={{
                width: "12%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              End Date
            </th>
            <th
              style={{
                width: "15%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Create Task Role
            </th>
            <th
              style={{
                width: "15%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Edit Open Task Role
            </th>
            <th
              style={{
                width: "15%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Edit To Do Tasks
            </th>
            <th
              style={{
                width: "15%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Edit Doing Tasks
            </th>
            <th
              style={{
                width: "15%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              Edit Done Tasks
            </th>
            <th
              style={{
                width: "10%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              &nbsp;
            </th>
            <th
              style={{
                width: "10%",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody>
          {allApps &&
            allApps.map((app) => (
              <tr key={app.app_acronym}>
                <td>{app.app_acronym}</td>
                <td>{app.app_startdate}</td>
                <td>{app.app_enddate}</td>
                <td>{app.app_permit_create}</td>
                <td>{app.app_permit_open}</td>
                <td>{app.app_permit_todolist}</td>
                <td>{app.app_permit_doing}</td>
                <td>{app.app_permit_done}</td>
                <td>
                  <Button
                    onClick={() => {
                      handleViewApp(app.app_acronym);
                      // handleOpen();
                      handleAppOpen();
                    }}
                  >
                    View
                  </Button>
                </td>
                <td>
                  {/* <Button>Kanban</Button> */}
                  {/* <Button onClick={() => navigate(`/${app.app_acronym}/kanban`)}>Kanban</Button> */}
                  <Button onClick={() => navigate(`/app/${app.app_acronym}`)}>
                    Kanban
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>

      {/* //modal section */}
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h3>
              <b>Create Application</b>
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: "30px",
                  right: "20px",
                }}
              >
                X
              </Button>
              <h5 style={{ alignSelf: "flex-start" }}>App Details</h5>
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
                    // readOnly
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
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    name="newCreateTaskPermit"
                    onChange={(event, newValue) =>
                      setNewCreateTaskPermit(newValue)
                    }
                  ></Autocomplete>
                  <label>Edit Open Tasks</label>
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    name="newEditOpenTaskPermit"
                    onChange={(event, newValue) =>
                      setNewEditOpenTaskPermit(newValue)
                    }
                  />
                  <label>Edit To-Do Tasks:</label>
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    name="newEditToDoTaskPermit"
                    onChange={(event, newValue) =>
                      setNewEditToDoTaskPermit(newValue)
                    }
                  ></Autocomplete>{" "}
                  <label>Edit Doing Tasks:</label>
                  <Autocomplete
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
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    name="newEditDoneTaskPermit"
                    onChange={(event, newValue) =>
                      setNewEditDoneTaskPermit(newValue)
                    }
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
          </Box>
        </Modal>
      </div>
      <div>
        <ViewAppModal
          open={appOpen}
          handleClose={handleAppClose}
          selectedApp={selectedApp}
          setSelectedApp={setSelectedApp}
          setRefreshApp={setRefreshApp}
          isProjectLead={isProjectLead}
          setIsProjectLead={setIsProjectLead}
        />
      </div>
    </Page>
  );
}

export default About;
