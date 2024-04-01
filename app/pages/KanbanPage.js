import Page from "./Page";
import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import Autocomplete from "@mui/joy/Autocomplete";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Button from "@mui/joy/Button";
import Add from "@mui/icons-material/Add";
import Plans from "./Plans";
import ViewTask from "./ViewTask";
import Stack from "@mui/joy/Stack";
import AddTasks from "./AddTasks";
import Divider from "@mui/joy/Divider";
import { styled } from "@mui/joy/styles";
import Sheet from "@mui/joy/Sheet";
import { Box, Typography } from "@mui/joy";

function KanbanPage() {
  const Item = styled(Sheet)(({ theme }) => ({
    ...theme.typography["body-sm"],
    textAlign: "center",
    fontWeight: theme.fontWeight.md,
    alignItems: "center",
    color: theme.vars.palette.text.secondary,
    border: "1px solid rgba(0, 0, 0, 0.2)", // Translucent border
    padding: theme.spacing(2),
    borderRadius: 0, // Set borderRadius to 0 for square corners
    width: "100%", // Each item takes the full width
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Translucent background
  }));

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
    maxWidth: "1000px",
    maxHeight: "80%",
    overflowY: "auto",
    bgcolor: "white", // Set the background color
    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.2)", // Add box shadow
    p: 4,
  };

  const handleTaskAction = () => {
    // Callback function to refresh KanbanPage
    setRefreshTask((prev) => prev + 1);
  };
  const { app_acronym } = useParams();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openTask, setOpenTask] = React.useState(false);
  const handleOpenTask = () => setOpenTask(true);
  const handleCloseTask = () => setOpenTask(false);

  const [openSelectedTask, setOpenSelectedTask] = React.useState(false);
  const handleOpenSelectedTask = () => setOpenSelectedTask(true);
  const handleCloseSelectedTask = () => setOpenSelectedTask(false);

  const [allTasks, setAllTasks] = useState([]);

  const [task_id, setTaskId] = useState("");
  const [task_name, setTaskName] = useState("");
  const [task_owner, setTaskOwner] = useState("");
  const [task_status, setTaskStatus] = useState("");
  const [task_plan, setTaskPlan] = useState("");


  const [selectedTask, setSelectedTask] = useState([]);

  const [isPermittedCreate, setIsPermittedCreate] = useState(false);

  // Filter tasks based on task_status
  const openTasks = allTasks.filter((task) => task.task_status === "open");
  const todoTasks = allTasks.filter((task) => task.task_status === "todo");
  const doingTasks = allTasks.filter((task) => task.task_status === "doing");
  const doneTasks = allTasks.filter((task) => task.task_status === "done");
  const closedTasks = allTasks.filter((task) => task.task_status === "closed");

  const [refreshTask, setRefreshTask] = useState(0);

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted");
    async function checkGroup() {
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
        console.log(response.data);

        setIsPermittedCreate(response.data.success);
      } catch (error) {
        console.log(error);
        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkGroup();
  }, []);

  useEffect(() => {
    async function viewTasks(app_acronym) {
      try {
        const response = await axios.get("http://localhost:8080/task/all", {
          params: { task_app_acronym: app_acronym },
        });
        if (response.data && response.data.success === true) {
          setAllTasks(response.data.results);
          console.log(response.data.results);
          console.log("loaded tasks!");
        } else {
          console.log("Cant load tasks");
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        console.log("cant load tasks!");
      }
    }
    viewTasks(app_acronym);
  }, [refreshTask]);

  const handleViewTask = async (task_id) => {
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
  };

  return (
    <Page title="Kanban">
      <h2>Kanban</h2>
      {isPermittedCreate && (
        <Button
          onClick={() => {
            handleOpenTask();
          }}
          style={{
            float: "right",
          }}
        >
          Add Tasks
        </Button>
      )}
      <Button
        onClick={() => {
          handleOpen();
        }}
        style={{
          float: "right",
        }}
      >
        View Plans
      </Button>
      <p>Tasks for {app_acronym}</p>
      {/* Main Stack */}

      <Stack direction="row" spacing={0}>
        <Item>
          <Typography>OPEN</Typography>
          <Stack direction="column" spacing={1}>
            {openTasks.map((task) => (
              <Item
                key={task.task_id}
                sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}
              >
                <div>
                  <Typography>
                    <b>{task.task_id}</b>
                  </Typography>
                  <Typography>{task.task_name}</Typography>
                <Typography>Owner: {task.task_owner}</Typography>
                <Typography>Plan: {task.task_plan}</Typography>
                  <Button
                    onClick={() => {
                      handleViewTask(task.task_id);
                      handleOpenSelectedTask();
                    }}
                  >
                    View
                  </Button>
                </div>
              </Item>
            ))}
          </Stack>
        </Item>

        <Item>
          <Typography> TO DO</Typography>
          <Stack direction="column" spacing={1}>
            {todoTasks.map((task) => (
              <Item key={task.task_id}>
                <Typography>
                  <b>{task.task_id}</b>
                </Typography>
                <Typography>{task.task_name}</Typography>
                <Typography>Owner: {task.task_owner}</Typography>
                <Typography>Plan: {task.task_plan}</Typography>
                <Button
                  onClick={() => {
                    handleViewTask(task.task_id);
                    handleOpenSelectedTask();
                  }}
                >
                  View
                </Button>{" "}
              </Item>
            ))}
          </Stack>
        </Item>

        <Item>
          <Typography>DOING</Typography>
          <Stack direction="column" spacing={1}>
            {doingTasks.map((task) => (
              <Item key={task.task_id}>
                <Typography>
                  <b>{task.task_id}</b>
                </Typography>
                <Typography>{task.task_name}</Typography>
                <Typography>Owner: {task.task_owner}</Typography>
                <Typography>Plan: {task.task_plan}</Typography>
                <Button
                  onClick={() => {
                    handleViewTask(task.task_id);
                    handleOpenSelectedTask();
                  }}
                >
                  View
                </Button>{" "}
              </Item>
            ))}
          </Stack>
        </Item>

        <Item>
          <Typography>DONE</Typography>
          <Stack direction="column" spacing={1}>
            {doneTasks.map((task) => (
              <Item key={task.task_id}>
                <Typography>
                  <b>{task.task_id}</b>
                </Typography>
                <Typography>{task.task_name}</Typography>
                <Typography>Owner: {task.task_owner}</Typography>
                <Typography>Plan: {task.task_plan}</Typography>
                <Button
                  onClick={() => {
                    handleViewTask(task.task_id);
                    handleOpenSelectedTask();
                  }}
                >
                  View
                </Button>{" "}
              </Item>
            ))}
          </Stack>
        </Item>

        <Item>
          <Typography>CLOSED</Typography>
          <Stack direction="column" spacing={1}>
            {closedTasks.map((task) => (
              <Item key={task.task_id}>
                <Typography>
                  <b>{task.task_id}</b>
                </Typography>
                <Typography>{task.task_name}</Typography>
                <Typography>Status: {task.task_status}</Typography>
                <Typography>Owner: {task.task_owner}</Typography>
                <Typography>Plan: {task.task_plan}</Typography>


                <Button
                  onClick={() => {
                    handleViewTask(task.task_id);
                    handleOpenSelectedTask();
                  }}
                >
                  View
                </Button>{" "}
              </Item>
            ))}
          </Stack>
        </Item>
      </Stack>

      {/* <Stack direction="row" spacing={0}>
        <Item>OPEN</Item>
        <Item>TO DO</Item>
        <Item>DOING</Item>
        <Item>DONE</Item>
        <Item>CLOSED</Item>
      </Stack> */}
      <div>
        <Plans open={open} handleClose={handleClose} style={style} />
      </div>
      <div>
        <AddTasks
          openTask={openTask}
          handleCloseTask={handleCloseTask}
          style={style}
          setRefreshTask={setRefreshTask}
          onTaskAdded={() => {
            // Callback function to refresh KanbanPage
            setRefreshTask((prev) => prev + 1);
          }}
        />
      </div>
      <div>
        <ViewTask
          openSelectedTask={openSelectedTask}
          handleCloseSelectedTask={handleCloseSelectedTask}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          style={style}
          onTaskAction={handleTaskAction}
        />
      </div>
    </Page>
  );
}

export default KanbanPage;
