import Page from "./Page";
import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import Autocomplete from "@mui/joy/Autocomplete";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Box, Button, Table, Input } from "@mui/joy";

function EditPlans({ plan, app_acronym, handleRefresh }) {
  const [plan_mvp_name, setPlanMvpName] = useState("");
  const [plan_startdate, setPlanStartDate] = useState("");
  const [plan_enddate, setPlanEndDate] = useState("");
  const [plan_app_acronym, setPlanAppAcronym] = useState("");

  const [isPermittedOpen, setIsPermittedOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  // const { app_acronym } = useParams();

  const handleEdit = () => {
    // setplan(plan);
    console.log(plan.plan_app_acronym);
    setPlanAppAcronym(plan.plan_app_acronym);
    setPlanMvpName(plan.plan_mvp_name);
    setPlanStartDate(plan.plan_startdate);
    setPlanEndDate(plan.plan_enddate);
    setIsEditing(true);
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
            console.log(error);
            throw new Error(error.message);
          });
        console.log(response);
        console.log("did you run anot");

        setIsPermittedOpen(response.data.success);
      } catch (error) {
        console.log(error);
        console.log("what is it", app_acronym);

        // handleAlerts(error.message, false);
        console.log("cannot check");
      }
    }
    checkGroup();
  }, []);

  async function handleEditPlan(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/plan/update", {
        plan_mvp_name,
        plan_startdate,
        plan_enddate,
        app_acronym,
        permitName: "open",
      });
      if (response.data) {
        setPlanMvpName(plan.plan_mvp_name);
        setPlanStartDate(plan.plan_startdate);
        setPlanEndDate(plan.plan_enddate);
        console.log(response.data.message);
        console.log(plan_mvp_name);
        toast.success("Plan updated!", {
          autoClose: 700,
        });
        handleRefresh();
        setIsEditing(false);
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update plan!", {
        autoClose: 700,
      });
    }
  }

  return (
    <tr key={plan.plan_app_acronym}>
      {isEditing ? (
        <td>
          <Input
            readOnly = {true}
            name="plan_mvp_name"
            value={plan_mvp_name}
            onChange={(e) => setPlanMvpName(e.target.value)}
          />
        </td>
      ) : (
        <td>{plan.plan_mvp_name}</td>
      )}
      {isEditing ? (
        <td>
          {" "}
          <Input
            type="date"
            value={plan_startdate}
            onChange={(e) => setPlanStartDate(e.target.value)}
          />
        </td>
      ) : (
        <td>{plan.plan_startdate}</td>
      )}
      {isEditing ? (
        <td>
          {" "}
          <Input
            type="date"
            value={plan_enddate}
            onChange={(e) => setPlanEndDate(e.target.value)}
          />
        </td>
      ) : (
        <td>{plan.plan_enddate}</td>
      )}
      {isPermittedOpen &&
        (isEditing ? (
          <td>
            <Button onClick={handleEditPlan}>Save</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </td>
        ) : (
          <td>
            <Button onClick={handleEdit}>Edit</Button>
          </td>
        ))}
    </tr>
  );
}

export default EditPlans;
