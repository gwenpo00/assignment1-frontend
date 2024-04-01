import React, { useState, useContext, useEffect } from "react";
import { Modal, Box, Button, Input } from "@mui/joy";
import { Autocomplete } from "@mui/joy";
import axios from "axios";
import { toast } from "react-toastify";
import Textarea from "@mui/joy/Textarea";

const ViewAppModal = ({
  open,
  handleClose,
  selectedApp,
  setSelectedApp,
  setRefreshApp,
  isProjectLead,
  setIsProjectLead,
}) => {
  const [app_acronym, setAcronym] = useState("");
  const [app_rnumber, setAppRNo] = useState("");
  const [app_description, setDescription] = useState("");
  const [app_startdate, setStartDate] = useState("");
  const [app_enddate, setEndDate] = useState("");

  const [app_permit_create, setCreateTaskPermit] = useState([]);
  const [app_permit_open, setEditOpenTaskPermit] = useState([]);
  const [app_permit_todolist, setEditToDoTaskPermit] = useState([]);
  const [app_permit_doing, setEditDoingTaskPermit] = useState([]);
  const [app_permit_done, setEditDoneTaskPermit] = useState([]);

  const [isEditing, setIsEditing] = useState(false);

  const [groupsNames, setAllGroupsNames] = useState([]);

  const style = {
    // display: "flex",
    // flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxWidth: "800px",
    maxHeight: "80%",
    overflowY: "auto",
    bgcolor: "white", // Set the background color
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)", // Add box shadow
    p: 4,
  };

  const closeModal = () => {
    setIsEditing(false);
  };

  const handleButtonClick = () => {
    handleClose();
    closeModal();
  };

  const handleEdit = () => {
    setAcronym(selectedApp.app_acronym);
    setAppRNo(selectedApp.app_rnumber);
    setDescription(selectedApp.app_description);
    setStartDate(selectedApp.app_startdate);
    setEndDate(selectedApp.app_enddate);
    setCreateTaskPermit(selectedApp.app_permit_create);
    setEditOpenTaskPermit(selectedApp.app_permit_open);
    setEditToDoTaskPermit(selectedApp.app_permit_todolist);
    setEditDoingTaskPermit(selectedApp.app_permit_doing);
    setEditDoneTaskPermit(selectedApp.app_permit_done);
    setIsEditing(true);
  };

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

  async function handleSave(e) {
    e.preventDefault();
    if (app_description.length > 255) {
      toast.error("Description should be less than 255 characters.", {
        autoClose: 700,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/app/update", {
        app_acronym,
        app_description,
        app_startdate,
        app_enddate,
        app_permit_create,
        app_permit_open,
        app_permit_todolist,
        app_permit_doing,
        app_permit_done,
      });
      console.log(response);
      if (response.data) {
        // setAcronym(app_acronym);
        // setAppRNo(app_rnumber);
        // setDescription(app_description);
        // setStartDate(app_startdate);
        // setEndDate(app_enddate);
        setSelectedApp({
          app_acronym,
          app_rnumber,
          app_description,
          app_startdate,
          app_enddate,
          app_permit_create,
          app_permit_open,
          app_permit_todolist,
          app_permit_doing,
          app_permit_done,
        });
        setRefreshApp((prev) => prev + 1);
        console.log(response.data);
        setIsEditing(false);
        toast.success("User details updated successfully!", {
          autoClose: 700,
        });
        setIsEditing(false);
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      console.log("Failed to edit application");
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      // onClick={}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Button
          onClick={handleButtonClick}
          style={{
            position: "absolute",
            top: "30px",
            right: "20px",
          }}
        >
          X
        </Button>
        {/* Check if a selectedApp exists before rendering */}
        {selectedApp && (
          <>
            <h3>
              <b>Application Details</b>
            </h3>
            {/* Display details of the selected application */}
            <div className="form-group" style={{ width: "50%" }}>
              <div style={{ width: "100%" }}>
                <label>Acronym:</label>
                {isEditing ? (
                  <Input
                    readOnly
                    type="text"
                    defaultValue={selectedApp.app_acronym}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                ) : (
                  <Input
                    readOnly
                    type="text"
                    value={selectedApp.app_acronym}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}

                <label>App RNo.</label>
                {isEditing ? (
                  <Input
                    readOnly
                    type="text"
                    defaultValue={selectedApp.app_rnumber}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                ) : (
                  <Input
                    readOnly
                    type="text"
                    value={selectedApp.app_rnumber}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}

                <label>Description:</label>
                {isEditing ? (
                  <Textarea
                    type="text"
                    defaultValue={selectedApp.app_description}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      // height: "100px",
                    }}
                    onChange={(e) => setDescription(e.target.value)}
                    minRows={15}
                    maxRows={100}
                  />
                ) : (
                  <Textarea
                    readOnly
                    type="text"
                    value={selectedApp.app_description}
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      // height: "100px",
                    }}
                    minRows={15}
                    maxRows={100}
                  />
                )}

                <label>Start Date:</label>
                {isEditing ? (
                  <Input
                    type="date"
                    defaultValue={selectedApp.app_startdate}
                    style={{ width: "70%", marginBottom: "10px" }}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                ) : (
                  <Input
                    type="text"
                    value={selectedApp.app_startdate}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}

                <label>End Date:</label>
                {isEditing ? (
                  <Input
                    type="date"
                    defaultValue={selectedApp.app_enddate}
                    style={{ width: "70%", marginBottom: "10px" }}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                ) : (
                  <Input
                    readOnly
                    type="text"
                    value={selectedApp.app_enddate}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}
              </div>
            </div>
            <div className="form-group" style={{ width: "50%" }}>
              <div style={{ width: "100%" }}>
                <label>Create Tasks:</label>
                {isEditing ? (
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    defaultValue={app_permit_create}
                    onChange={(e, newValue) => setCreateTaskPermit(newValue)}
                  ></Autocomplete>
                ) : (
                  <Input
                    value={selectedApp.app_permit_create}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}
                <label>Edit Open Tasks:</label>
                {isEditing ? (
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    defaultValue={app_permit_open}
                    onChange={(e, newValue) => setEditOpenTaskPermit(newValue)}
                  ></Autocomplete>
                ) : (
                  <Input
                    value={selectedApp.app_permit_open}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}
                <label>Edit To-Do Tasks:</label>
                {isEditing ? (
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    defaultValue={app_permit_todolist}
                    onChange={(e, newValue) => setEditToDoTaskPermit(newValue)}
                  ></Autocomplete>
                ) : (
                  <Input
                    value={selectedApp.app_permit_todolist}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}
                <label>Edit Doing Tasks:</label>
                {isEditing ? (
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    defaultValue={app_permit_doing}
                    onChange={(e, newValue) => setEditDoingTaskPermit(newValue)}
                  ></Autocomplete>
                ) : (
                  <Input
                    value={selectedApp.app_permit_doing}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}
                <label>Edit Done Tasks:</label>
                {isEditing ? (
                  <Autocomplete
                    style={{ width: "70%", marginBottom: "10px" }}
                    options={groupsNames.map((group) => group.groupname)}
                    getOptionLabel={(option) => option}
                    defaultValue={app_permit_done}
                    onChange={(e, newValue) => setEditDoneTaskPermit(newValue)}
                  ></Autocomplete>
                ) : (
                  <Input
                    value={selectedApp.app_permit_done}
                    style={{ width: "70%", marginBottom: "10px" }}
                  />
                )}
              </div>
            </div>
            {isProjectLead && isEditing ? (
              <div>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : isProjectLead ? (
              <Button onClick={handleEdit}>Edit</Button>
            ) : (
              <></>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ViewAppModal;
