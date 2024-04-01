import Page from "./Page";
import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import Autocomplete from "@mui/joy/Autocomplete";
import axios from "axios";
import EditPlans from "./EditPlans";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Add from "@mui/icons-material/Add";
import { Modal, Box, Button, Table, Input } from "@mui/joy";

function Plans({ open, handleClose, style }) {
  const { app_acronym } = useParams();

  const [new_plan_mvp_name, setNewPlanMvpName] = useState("");
  const [new_plan_startdate, setNewPlanStartDate] = useState("");
  const [new_plan_enddate, setNewPlanEndDate] = useState("");
  const [new_plan_app_acronym, setNewPlanAppAcronym] = useState("");

  const [plan_mvp_name, setPlanMvpName] = useState("");
  const [plan_startdate, setPlanStartDate] = useState("");
  const [plan_enddate, setPlanEndDate] = useState("");
  const [plan_app_acronym, setPlanAppAcronym] = useState("");

  const [allPlans, setAllPlans] = useState([]);
  const [isPermittedOpen, setIsPermittedOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [refreshCount, setRefreshCount] = useState(0);

  const handleEdit = () => {
    // setAllPlans(allPlans);
    setPlanAppAcronym(allPlans.plan_app_acronym);
    setPlanMvpName(allPlans.plan_mvp_name);
    setPlanStartDate(allPlans.plan_startdate);
    setPlanEndDate(allPlans.plan_enddate);
    setIsEditing(true);
  };

  // Function to handle the refresh
  const handleRefresh = () => {
    // Increment the refresh count to trigger the refresh
    setRefreshCount((prev) => prev + 1);
  };

  useEffect(() => {
    console.log("Running useEffect to check if user is permitted");
    async function checkGroup() {
      try {
        const response = await axios
          .post("http://localhost:8080/isPermitted", {
            app_acronym,
            permitName: "open",
          })
          .catch((error) => {
            console.log(app_acronym);
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
    checkGroup();
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
    handleViewPlans(app_acronym, refreshCount);
  }, [refreshCount]);

  async function handleAddPlan(e) {
    e.preventDefault();
    // Trim leading and trailing whitespaces
    const trimmedName = new_plan_mvp_name.trim();

    // Check if the trimmed name is empty after removing whitespaces
    if (!trimmedName) {
      toast.error("Plan name cannot be empty.", {
        autoClose: 700,
      });
      return;
    }

    // Check if the name has more than 45 characters
    if (trimmedName.length > 45) {
      toast.error("Plan name should be less than 45 characters.", {
        autoClose: 700,
      });
      return;
    }

    // Check if the name contains special characters
    const specialCharacters = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if (specialCharacters.test(trimmedName)) {
      toast.error("Plan name should not contain special characters.", {
        autoClose: 700,
      });
      return;
    }

    if (new_plan_mvp_name == "") {
      toast.error("Please fill in all fields.", {
        autoClose: 700,
      });
      return;
    }

    if (new_plan_startdate == "" || new_plan_enddate == "") {
      toast.error("Dates need to be filled!", {
        autoClose: 700,
      });
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/plan/add", {
        new_plan_mvp_name,
        new_plan_startdate,
        new_plan_enddate,
        new_plan_app_acronym: app_acronym,
        app_acronym,
        permitName: "open",
      });
      if (response.data) {
        toast.success("Plan added successfully!", {
          autoClose: 700,
        });
        console.log("Plan added!");
        document.getElementById("new_plan_mvp_name").value = "";
        document.getElementById("new_plan_startdate").value = "";
        document.getElementById("new_plan_enddate").value = "";
        handleRefresh();
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add plan!", {
        autoClose: 700,
      });
      console.log(new_plan_mvp_name);
      console.log(new_plan_enddate);
      console.log("Failed to add plan");
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <h3>
          <b>Plans</b>
        </h3>
        {isPermittedOpen && (
          <form onSubmit={handleAddPlan}>
            <label>Plan Name:</label>
            <Input
              name="new_plan_mvp_name"
              id="new_plan_mvp_name"
              onChange={(e) => setNewPlanMvpName(e.target.value)}
              style={{ width: "20%", marginBottom: "10px" }}
            />
            <label>Plan Start Date:</label>
            <Input
              name="new_plan_startdate"
              id="new_plan_startdate"
              type="date"
              onChange={(e) => setNewPlanStartDate(e.target.value)}
              style={{ width: "20%", marginBottom: "10px" }}
            />
            <label>Plan End Date:</label>
            <Input
              name="new_plan_enddate"
              id="new_plan_enddate"
              type="date"
              onChange={(e) => setNewPlanEndDate(e.target.value)}
              style={{ width: "20%", marginBottom: "10px" }}
            />

            <Button
              type="submit"
              style={{
                position: "absolute",
                top: "30px",
                right: "70px",
              }}
              startDecorator={<Add />}
            >
              Add Plan
            </Button>
          </form>
        )}

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
        <div style={{ marginTop: "10px" }}>
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
                  Plan Name
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
                    width: "5%",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                ></th>
              </tr>
            </thead>

            <tbody>
              {allPlans &&
                allPlans.map((plan) => (
                  <EditPlans
                    // allPlans={allPlans}
                    plan={plan}
                    // setAllPlans={setAllPlans}
                    key={plan.plan_app_acronym}
                    app_acronym={app_acronym}
                    handleRefresh={handleRefresh}
                    // isPermittedOpen={isPermittedOpen}
                  />
                ))}
            </tbody>
          </Table>
        </div>
      </Box>
    </Modal>
  );
}

export default Plans;
