import React, { useState, useContext, useEffect } from "react";
import { Modal, Box, Button, Input } from "@mui/joy";
import { Autocomplete } from "@mui/joy";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Textarea from "@mui/joy/Textarea";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

function AddTasks({
  openTask,
  handleCloseTask,
  style,
  setRefreshTask,
  onTaskAdded,
}) {
  const { app_acronym } = useParams();
  const [allPlans, setAllPlans] = useState([]);
  const [username, setUsername] = useState("");

  const [isPermittedCreate, setIsPermittedCreate] = useState(false);

  const [new_task_name, setNewTaskName] = useState("");
  const [new_task_id, setNewTaskId] = useState("");
  const [new_task_description, setNewTaskDescription] = useState("");
  const [new_task_status, setNewTaskStatus] = useState("");
  const [new_task_creator, setNewTaskCreator] = useState("");
  const [new_task_owner, setNewTaskOwner] = useState("");
  const [new_task_createdate, setNewTaskCreateDate] = useState("");
  const [new_task_notes, setNewTaskNotes] = useState("");
  const [new_task_plan, setNewTaskPlan] = useState("");
  const [new_task_app_acronym, setNewTaskAppAcronym] = useState("");

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted");
    async function checkPermit() {
      try {
        const response = await axios
          .post("http://localhost:8080/isPermitted", {
            app_acronym,
            permitName: "create",
          })
          .catch((error) => {
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        console.log("did you run anot");
        setIsPermittedCreate(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkPermit();
  });

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

  // Validation function for task_name
  function validateTaskName(taskName) {
    // Check if task_name is less than 45 characters
    if (taskName.length > 45) {
      return "Task name should be less than 45 characters.";
    }

    // Check if task_name is alphanumeric
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;
    if (!alphanumericRegex.test(taskName)) {
      return "Task name must be alphanumeric (alphabets, alphabet + numbers, numbers).";
    }

    // Check if task_name has special characters
    const specialCharactersRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if (specialCharactersRegex.test(taskName)) {
      return "Task name must not have special characters.";
    }

    // Check if task_name has trailing or leading spaces
    if (taskName.trim() !== taskName) {
      return "Task name must not have trailing and leading spaces.";
    }

    // If all checks pass, return null to indicate success
    return null;
  }

  // Updated handleAddTask function with validation
  async function handleAddTask(e) {
    e.preventDefault();

    // Validate task_name
    const taskNameValidation = validateTaskName(new_task_name);
    if (taskNameValidation) {
      toast.error(taskNameValidation, {
        autoClose: 700,
      });
      return;
    }
    if (new_task_description.length > 255) {
      toast.error("Description should be less than 255 characters.", {
        autoClose: 700,
      });
      return;
    }

    // Continue with the API call if validation passes
    try {
      const response = await axios.post("http://localhost:8080/task/add", {
        new_task_name,
        new_task_plan,
        new_task_description,
        new_task_notes,
        new_task_app_acronym: app_acronym,
        new_task_creator: username,
        new_task_owner: username,
        app_acronym,
        permitName: "create",
      });

      if (response.data) {
        onTaskAdded();
        toast.success("Task added successfully!", {
          autoClose: 700,
        });
        console.log("Task added");
      } else {
        console.log(response.data.message);
        console.log("Task not added");
      }
    } catch (error) {
      console.log(error);
      console.log("Task not added");
      toast.error("Failed to add task!", {
        autoClose: 700,
      });
    }
  }

  return (
    <Modal
      open={openTask}
      onClose={handleCloseTask}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <h3>
            <b>Add Task {username}</b>
          </h3>
          <Button
            onClick={handleCloseTask}
            style={{
              position: "absolute",
              top: "30px",
              right: "20px",
            }}
          >
            X
          </Button>
          <form onSubmit={handleAddTask}>
            <label>Task Name:</label>
            <Input
              id="new_task_name"
              style={{ width: "30%", marginBottom: "10px" }}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
            <label>Plan:</label>
            <Autocomplete
              id="new_task_plan"
              style={{ width: "30%", marginBottom: "10px" }}
              options={allPlans.map((plan) => plan.plan_mvp_name)}
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => setNewTaskPlan(newValue)}
            />
            <label>Description:</label>
            <Textarea
              id="new_task_description"
              style={{ width: "50%", marginBottom: "10px", height: "100px" }}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <label>Notes:</label>
            <Textarea
              id="new_task_notes"
              style={{ width: "90%", marginBottom: "10px", height: "150px" }}
              onChange={(e) => setNewTaskNotes(e.target.value)}
            />
            <Button
              type="submit"
              style={{
                position: "absolute",
                //   top: "30px",
                right: "20px",
              }}
              // onClick={handleCloseTask}
            >
              Add Task
            </Button>
          </form>{" "}
        </div>
      </Box>
    </Modal>
  );
}

export default AddTasks;
