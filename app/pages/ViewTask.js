import React, { useState, useContext, useEffect } from "react";
import { Modal, Box, Button, Input, Typography } from "@mui/joy";
import { Autocomplete } from "@mui/joy";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "@mui/joy/Textarea";

const ViewTask = ({
  openSelectedTask,
  handleCloseSelectedTask,
  style,
  onTaskAction,
  selectedTask,
  setSelectedTask,
}) => {
  const [task_id, setTaskId] = useState("");
  const [task_name, setTaskName] = useState("");
  const [task_owner, setTaskOwner] = useState("");
  const [task_plan, setTaskPlan] = useState([]);
  const [task_description, setTaskDescription] = useState("");
  const [task_notes, setTaskNotes] = useState("");
  const [task_status, setTaskStatus] = useState("");

  const { app_acronym } = useParams();
  const [allPlans, setAllPlans] = useState([]);
  const [username, setUsername] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isPermittedOpen, setIsPermittedOpen] = useState(false);
  const [isPermittedTodo, setIsPermittedTodo] = useState(false);
  const [isPermittedDoing, setIsPermittedDoing] = useState(false);
  const [isPermittedDone, setIsPermittedDone] = useState(false);

  const [isTaskPlanChanged, setIsTaskPlanChanged] = useState(false);

  const [isSaveButtonChanged, setIsSaveButtonChanged] = useState(false);

  const [isOpenState, setOpenState] = useState(false);

  const [refreshViewTask, setRefreshViewTask] = useState(0);

  //   const [selectedTask, setSelectedTask] = useState([]);

  const closeModal = () => {
    setIsEditing(false);
  };

  const handleButtonClick = () => {
    handleCloseSelectedTask();
    closeModal();
  };

  const handleSavePromoteOpen = () => {
    // handleEditOpenTask();
    handlePromoteTask();
    handleEditSave();
    onTaskAction();
    handleCloseSelectedTask();
  };

  const handleSaveDemoteOpen = () => {
    // handleEditOpenTask();
    handleDemoteTask();
    handleEditSave();
    onTaskAction();
    handleCloseSelectedTask();
  };

  useEffect(() => {
    async function handleViewTask(task_id) {
      try {
        const response = await axios.get("http://localhost:8080/task/view", {
          params: { task_id },
        });
        if (response.data && response.data.success === true) {
          setSelectedTask(response.data.results);
          console.log(response.data.results);
          console.log("loaded task!");
        } else {
          console.log("Cant load task");
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        console.log("cant load task!");
      }
    }
    handleViewTask(task_id);
  }, []);

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted");
    async function checkPermitOpen() {
      try {
        const response = await axios
          .post("http://localhost:8080/isPermitted", {
            app_acronym,
            permitName: "open",
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        console.log("did you run anot");
        setIsPermittedOpen(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkPermitOpen();
  }, []);

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted");
    async function checkPermitTodo() {
      try {
        const response = await axios
          .post("http://localhost:8080/isPermitted", {
            app_acronym,
            permitName: "todo",
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        console.log("did you run anot");
        setIsPermittedTodo(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkPermitTodo();
  }, []);

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted for doing");
    async function checkPermitDoing() {
      try {
        const response = await axios
          .post("http://localhost:8080/isPermitted", {
            app_acronym,
            permitName: "doing",
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log("doing", response);
        console.log("did you run anot");
        setIsPermittedDoing(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkPermitDoing();
  }, []);

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted");
    async function checkPermitDone() {
      try {
        const response = await axios
          .post("http://localhost:8080/isPermitted", {
            app_acronym,
            permitName: "done",
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        console.log("did you run anot");
        setIsPermittedDone(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkPermitDone();
  }, []);

  useEffect(() => {
    async function handleViewPlans(app_acronym) {
      try {
        const response = await axios.get("http://localhost:8080/plan/all", {
          params: { plan_app_acronym: app_acronym },
        });
        if (response.data && response.data.success === true) {
          setAllPlans(response.data.results);
          console.log(response.data.results);
          console.log("loaded plans!");
        } else {
          console.log("Cant load plans");

          console.log(response);
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        console.log(error);
        console.log("cant load plans!");
      }
    }
    handleViewPlans(app_acronym);
  }, []);

  const handleEdit = () => {
    setTaskOwner(username);
    setTaskStatus(selectedTask.task_status);
    setTaskId(selectedTask.task_id);
    setTaskName(selectedTask.task_name);
    setTaskDescription(selectedTask.task_description);
    setTaskNotes("");
    setTaskPlan(selectedTask.task_plan);
    setIsEditing(true);
  };

  useEffect(() => {
    console.log("Running useEffect to get username");
    async function getProfile() {
      try {
        const response = await axios.get("http://localhost:8080/profile");
        console.log(response.data);
        if (response.data && response.data.success === true) {
          setUsername(response.data.results.username);
          console.log("ok");
        } else {
          console.log("canot");
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        console.log(error);
        console.log("cannot");
      }
    }
    getProfile();
  });

  async function handleDemoteTask() {
    try {
      if (task_status == "doing") {
        const response = await axios.post(
          "http://localhost:8080/task/demote/doing",
          {
            task_id,
            task_status,
            app_acronym,
            permitName: "doing",
          }
        );
        if (response.data) {
          console.log(response.data);
          // setIsEditing(false);
          toast.success("Task demoted successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "done") {
        const response = await axios.post(
          "http://localhost:8080/task/demote/done",
          {
            task_id,
            task_status,
            app_acronym,
            permitName: "done",
          }
        );
        if (response.data) {
          console.log(response.data);
          // setIsEditing(false);
          toast.success("Task demoted successfully!", {
            autoClose: 700,
          });
        }
      }
    } catch {
      console.log(error);
      toast.error("Task cannot be demoted!", {
        autoClose: 700,
      });
      console.log("Failed to demote task!");
    }
  }

  async function handlePromoteTask() {
    // e.preventDefault();
    try {
      if (task_status == "open") {
        const response = await axios.post(
          "http://localhost:8080/task/promote/open",
          {
            task_id,
            task_status,
            app_acronym,
            permitName: "open",
          }
        );
        if (response.data) {
          console.log(response.data);
          // setIsEditing(false);
          toast.success("Task promoted successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "todo") {
        const response = await axios.post(
          "http://localhost:8080/task/promote/todo",
          {
            task_id,
            task_status,
            app_acronym,
            permitName: "todo",
          }
        );
        if (response.data) {
          console.log(response.data);
          // setIsEditing(false);
          toast.success("Task promoted successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "doing") {
        const response = await axios.post(
          "http://localhost:8080/task/promote/doing",
          {
            task_id,
            task_status,
            app_acronym,
            permitName: "doing",
          }
        );
        if (response.data) {
          console.log("hello kitty");
          console.log(response.data);
          toast.success("Task promoted successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "done") {
        const response = await axios.post(
          "http://localhost:8080/task/promote/done",
          {
            task_id,
            task_status,
            app_acronym,
            permitName: "done",
          }
        );
        if (response.data) {
          console.log("hello kitty");
          console.log(response.data);
          toast.success("Task promoted successfully!", {
            autoClose: 700,
          });
        }
      } else {
        throw new Error("Invalid task status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Task cannot be promoted!", {
        autoClose: 700,
      });
      console.log("Failed to promote task!");
    }
  }

  async function handleEditSave() {
    try {
      if (task_status == "open") {
        const response = await axios.post(
          "http://localhost:8080/task/update/open",
          {
            username,
            task_status,
            task_id,
            task_name,
            task_owner,
            task_plan,
            task_description,
            task_notes,
            app_acronym,
            permitName: "open",
          }
        );
        console.log(response);
        if (response.data) {
          setSelectedTask({
            task_id,
            task_name,
            task_owner,
            task_plan,
            task_description,
            task_notes,
            task_status,
          });
          //   const reloadTask = await handleViewTask();
          console.log(response.data);
          console.log("isSaveButtonChanged:", isPermittedOpen);
          onTaskAction();

          setRefreshViewTask((prev) => prev + 1);
          setIsEditing(false);
          setOpenState(true);
          toast.success("Open task details updated successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "todo") {
        const response = await axios.post(
          "http://localhost:8080/task/update/todo",
          {
            username,
            task_status,
            task_id,
            task_name,
            task_owner,
            task_description,
            task_notes,
            app_acronym,
            permitName: "todo",
          }
        );
        console.log(response);
        if (response.data) {
          setSelectedTask({
            task_id,
            task_name,
            task_owner,
            task_plan,
            task_description,
            task_notes,
            task_status,
          });
          console.log(response.data);
          onTaskAction();

          setIsEditing(false);
          toast.success("Todo task details updated successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "doing") {
        const response = await axios.post(
          "http://localhost:8080/task/update/doing",
          {
            username,
            task_status,
            task_id,
            task_name,
            task_owner,
            task_description,
            task_notes,
            app_acronym,
            permitName: "doing",
          }
        );
        console.log(response);
        if (response.data) {
          setSelectedTask({
            task_id,
            task_name,
            task_owner,
            task_plan,
            task_description,
            task_notes,
            task_status,
          });
          console.log(response.data);
          onTaskAction();

          setIsEditing(false);
          toast.success("Todo task details updated successfully!", {
            autoClose: 700,
          });
        }
      } else if (task_status == "done") {
        const response = await axios.post(
          "http://localhost:8080/task/update/done",
          {
            username,
            task_status,
            task_id,
            task_name,
            task_owner,
            task_description,
            task_notes,
            app_acronym,
            permitName: "done",
          }
        );
        console.log(response);
        if (response.data) {
          setSelectedTask({
            task_id,
            task_name,
            task_owner,
            task_plan,
            task_description,
            task_notes,
            task_status,
          });
          console.log(response.data);
          onTaskAction();

          setIsEditing(false);
          toast.success("Todo task details updated successfully!", {
            autoClose: 700,
          });
        }
      } else {
        throw new Error("Invalid task status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Task cannot be updated!", {
        autoClose: 700,
      });
      console.log("Failed to edit task!");
    }
  }

  return (
    <Modal
      key={refreshViewTask}
      open={openSelectedTask}
      onClose={handleCloseSelectedTask}
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
        <h3>
          <b>View Task</b>
        </h3>
        <Typography level="body-xs">
          Status: {selectedTask.task_status}
        </Typography>
        <Box sx={{ marginTop: 2 }} />

        <div className="form-group" style={{ width: "50%" }}>
          <div style={{ width: "100%" }}>
            <Typography>
              <b>Task ID:</b>
            </Typography>
            <Typography style={{ marginBottom: "10px" }}>
              {selectedTask.task_id}
            </Typography>
            <Box sx={{ marginTop: 2 }} />

            <Typography>
              <b>Task Plan:</b>
            </Typography>

            {/* {selectedTask.task_status == "open" || selectedTask.task_status == "done"  ? (
              isEditing ? (
                <Autocomplete
                  style={{ width: "50%", marginBottom: "10px" }}
                  options={allPlans.map((plan) => plan.plan_mvp_name)}
                  getOptionLabel={(option) => option}
                  defaultValue={selectedTask.task_plan}
                  onChange={(e, newValue) => setTaskPlan(newValue)}
                />
              ) : (
                <Input
                  readOnly={true}
                  style={{ width: "50%" }}
                  value={selectedTask.task_plan}
                ></Input>
              )
            ) : (
              <Input
                style={{ width: "50%" }}
                value={selectedTask.task_plan}
              ></Input>
            )} */}

            {/* {selectedTask.task_status === "open" ||
            selectedTask.task_status === "done" ? (
              isEditing ? (
                <Autocomplete
                  style={{ width: "50%", marginBottom: "10px" }}
                  options={allPlans.map((plan) => plan.plan_mvp_name)}
                  getOptionLabel={(option) => option}
                  defaultValue={selectedTask.task_plan}
                  // Update the Autocomplete onChange to set the flag
                  onChange={(e, newValue) => {
                    setTaskPlan(newValue);
                    setIsTaskPlanChanged(true);
                    if (selectedTask.task_plan == newValue) {
                      setIsSaveButtonChanged(true);
                    } else {
                      setIsSaveButtonChanged(false);
                    }
                    // Show a toast notification
                    toast.info(
                      'Changing the plan will disable "Save and Promote"',
                      {
                        autoClose: 3000,
                      }
                    );
                  }}
                />
              ) : (
                <Input
                  readOnly={true}
                  style={{ width: "50%" }}
                  value={selectedTask.task_plan}
                ></Input>
              )
            ) : (
              <Input
                style={{ width: "50%" }}
                value={selectedTask.task_plan}
              ></Input>
            )} */}

            {selectedTask.task_status === "done" ? (
              isEditing ? (
                <Autocomplete
                  style={{ width: "50%", marginBottom: "10px" }}
                  options={allPlans.map((plan) => plan.plan_mvp_name)}
                  getOptionLabel={(option) => option}
                  defaultValue={selectedTask.task_plan}
                  // Update the Autocomplete onChange to set the flag
                  onChange={(e, newValue) => {
                    setTaskPlan(newValue);
                    setIsTaskPlanChanged(true);
                    if (selectedTask.task_plan === newValue) {
                      setIsSaveButtonChanged(true);
                    } else {
                      setIsSaveButtonChanged(false);
                    }
                    // Show a toast notification
                    toast.info(
                      'Changing the plan will disable "Save and Promote"',
                      {
                        autoClose: 3000,
                      }
                    );
                  }}
                />
              ) : (
                <Input
                  style={{ width: "50%" }}
                  value={selectedTask.task_plan}
                />
              )
            ) : selectedTask.task_status === "open" ? (
              isEditing ? (
                <Autocomplete
                  style={{ width: "50%", marginBottom: "10px" }}
                  options={allPlans.map((plan) => plan.plan_mvp_name)}
                  getOptionLabel={(option) => option}
                  defaultValue={selectedTask.task_plan}
                  // Update the Autocomplete onChange to set the flag
                  onChange={(e, newValue) => {
                    setTaskPlan(newValue);
                    setIsTaskPlanChanged(true);
                  }}
                />
              ) : (
                <Input
                  readOnly={true}
                  style={{ width: "50%" }}
                  value={selectedTask.task_plan}
                />
              )
            ) : (
              <Input
                readOnly={true}
                style={{ width: "50%" }}
                value={selectedTask.task_plan}
              />
            )}

            <Box sx={{ marginTop: 2 }} />

            <Typography>
              <b>Task Description:</b>
            </Typography>
            {isEditing ? (
              <Textarea
                style={{ width: "100%", marginBottom: "10px", height: "150px" }}
                value={task_description}
                onChange={(e) => setTaskDescription(e.target.value)}
              ></Textarea>
            ) : (
              <Textarea
                readOnly={true}
                style={{ width: "100%", marginBottom: "10px", height: "150px" }}
                value={selectedTask.task_description}
              ></Textarea>
            )}

            <Box sx={{ marginTop: 2 }} />

            <Typography>
              <b>Task Notes:</b>
            </Typography>
            <Textarea
              readOnly={true}
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
              minRows={10}
              maxRows={10}
              value={selectedTask.task_notes}
            ></Textarea>

            <Box sx={{ marginTop: 2 }} />

            <Typography>
              <b>Add Notes:</b>
            </Typography>
            {isEditing ? (
              <Textarea
                style={{ width: "100%", marginBottom: "10px", height: "150px" }}
                onChange={(e) => setTaskNotes(e.target.value)}
                value={task_notes}
              ></Textarea>
            ) : (
              <Textarea
                readOnly={true}
                style={{ width: "100%", marginBottom: "10px", height: "150px" }}
              ></Textarea>
            )}

            <Box sx={{ marginTop: 2 }} />

            {selectedTask.task_status === "open" &&
              isPermittedOpen &&
              (isEditing ? (
                <div>
                  <Button
                    onClick={() => {
                      handleEditSave();
                      handleCloseSelectedTask();
                    }}
                  >
                    Save
                  </Button>
                  <Button onClick={handleSavePromoteOpen}>
                    Save and Promote
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={handleEdit}>Edit</Button>
              ))}

            {selectedTask.task_status === "todo" &&
              isPermittedTodo &&
              (isEditing ? (
                <div>
                  <Button
                    onClick={() => {
                      handleEditSave();
                      handleCloseSelectedTask();
                    }}
                  >
                    Save
                  </Button>{" "}
                  <Button onClick={handleSavePromoteOpen}>
                    Save and Promote
                  </Button>
                  {/* {selectedTask.task_status === "doing" ||
      selectedTask.task_status === "done" ? (
        <Button onClick={handleSaveDemoteOpen}>Save and Demote</Button>
      ) : (
        <div></div>
      )} */}
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={handleEdit}>Edit</Button>
              ))}

            {selectedTask.task_status === "doing" &&
              isPermittedDoing &&
              (isEditing ? (
                <div>
                  <Button
                    onClick={() => {
                      handleEditSave();
                      handleCloseSelectedTask();
                    }}
                  >
                    Save
                  </Button>{" "}
                  <Button onClick={handleSavePromoteOpen}>
                    Save and Promote
                  </Button>
                  {selectedTask.task_status === "doing" ||
                  selectedTask.task_status === "done" ? (
                    <Button onClick={handleSaveDemoteOpen}>
                      Save and Demote
                    </Button>
                  ) : (
                    <div></div>
                  )}
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              ) : (
                <Button onClick={handleEdit}>Edit</Button>
              ))}

            {selectedTask.task_status === "done" &&
              isPermittedDone &&
              (isEditing ? (
                isTaskPlanChanged ? (
                  <div>
                    <Button disabled onClick={handleSavePromoteOpen}>
                      Save and Promote
                    </Button>
                    {isSaveButtonChanged ? (
                      <Button
                        onClick={() => {
                          handleEditSave();
                          handleCloseSelectedTask();
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button disabled onClick={handleEditSave}>
                        Save
                      </Button>
                    )}
                    <Button onClick={handleSaveDemoteOpen}>
                      Save and Demote
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                ) : (
                  <div>
                    <Button onClick={handleSavePromoteOpen}>
                      Save and Promote
                    </Button>
                    <Button onClick={handleEditSave}>Save</Button>
                    <Button onClick={handleSaveDemoteOpen}>
                      Save and Demote
                    </Button>
                    <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                )
              ) : (
                <Button onClick={handleEdit}>Edit</Button>
              ))}

            {selectedTask.task_status === "closed" && <div></div>}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ViewTask;
