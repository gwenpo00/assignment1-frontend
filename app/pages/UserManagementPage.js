import Page from "./Page";
import React, { useState, useContext, useEffect } from "react";
import GlobalContext from "./GlobalContext";
import Autocomplete from "@mui/joy/Autocomplete";
import axios from "axios";
import ViewAllUsers from "./ViewAllUsers";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UserManagementPage() {
  const [newUsername, setUsername] = useState("");
  const [newPassword, setPassword] = useState("");
  const [newEmail, setEmail] = useState("");
  const [newUserGroup, setUserGroup] = useState([]);
  const [newActive, setActive] = useState("1");

  const [newGroup, setGroup] = useState("");

  const [allGroups, setAllGroups] = useState([]);
  const [addGroupRequest, setAddGroupRequest] = useState(0);

  const [groupsNames, setAllGroupsNames] = useState([]);

  const [allUsers, setAllUsers] = useState([]);
  const [rerenderAC, setRerenderAC] = useState(false);

  const { setIsAdmin } = useContext(GlobalContext);

  const [refreshUser, setRefreshUser] = useState(0);
  // Sample data for the table (replace with your actual data)

  const navigate = useNavigate();
  const initialUsers = [
    {
      id: 1,
      username: "user1",
      password: "password1",
      email: "user1@example.com",
      group: "Group 1",
      activity: "Active",
    },
  ];

  useEffect(() => {
    console.log("Loading groups...");
    async function getAllGroups() {
      try {
        const response = await axios.get("http://localhost:8080/groups/all");
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

  async function handleAddGroups(e) {
    e.preventDefault();
    const validGroupName = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(newGroup);
    if (!validGroupName) {
      toast.error(
        "Group name should only contain letters and numbers, and no spaces or special characters.",
        {
          autoClose: 700,
        }
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/groups/add", {
        newGroup,
      });
      console.log(response);

      if (response.data) {
        setGroup("");
        setRefreshUser((prev) => prev + 1);
        document.getElementById("newGroup").value = "";
        toast.success("Group added successfully!", {
          autoClose: 700,
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (error.response.data.message.includes("not authorised")) {
        navigate("/");
        toast.error("You are not authorised!", {
          autoClose: 700,
        });
        setIsAdmin(false);
      }
      toast.error("Failed to add group!", {
        autoClose: 700,
      });
      console.log("Failed to add group");
      console.log(error);
    }
  }

  // Function to check password requirements
  const checkPasswordRequirements = (password) => {
    // Check if the password meets the requirements
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/;
    if (!passwordRegex.test(password)) {
      // If the password doesn't meet the requirements, show a toast message
      toast.error(
        "Password must be 8-10 characters and include alphabets, numbers, and special characters.",
        {
          autoClose: 700,
        }
      );
      return false;
    }
    return true;
  };

  async function handleAddUsers(e) {
    e.preventDefault();
    const validUsername = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/.test(newUsername);
    if (!validUsername) {
      toast.error(
        "Username should only contain letters and numbers, and no spaces or special characters.",
        {
          autoClose: 700,
        }
      );
      return;
    }
  
    try {
      if (!checkPasswordRequirements(newPassword)) {
        return;
      }
      const response = await axios.post("http://localhost:8080/users/add", {
        newUsername,
        newPassword,
        newEmail,
        newUserGroup,
        newActive,
      });
      console.log("TESTING123", newUserGroup);
      console.log(response);
      if (response.data.message.includes("added")) {
        document.getElementById("newUsername").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("newEmail").value = "";
        setRerenderAC(!rerenderAC);
        setRefreshUser((prev) => prev + 1);
        console.log("TESTING123", newUserGroup);
        toast.success("User added successfully!", {
          autoClose: 700,
        });
      } else {
        // Log the response data when the request is successful but the server returns an error
        console.log(response.data.message);
        toast.error("Failed to add user!", {
          autoClose: 700,
        });
      }
    } catch (error) {
      // Log the entire error object to understand its structure
      console.log(error);
  
      // If needed, you can access specific properties of the error object
      if (error.response && error.response.data) {
        console.log(error.response.data);
      }
  
      // Handle the error or rethrow it
      if (error.response && error.response.data.message.includes("not authorised")) {
        navigate("/");
        toast.error("You are not authorised!", {
          autoClose: 700,
        });
      } else {
        toast.error("Failed to add user123!", {
          autoClose: 700,
        });
      }
    }
  }
  
  useEffect(() => {
    console.log("Getting profile information");
    async function getProfileDetails() {
      try {
        const response = await axios.get("http://localhost:8080/users/all");
        if (response.data && response.data.success === true) {
          //   setUsername(response.data.results.username);
          //   setEmail(response.data.results.email);
          //   setGroupname(response.data.results.groupname);
          //   setActive(response.data.results.active);
          setAllUsers(response.data.results);
          console.log(response.data.results);
          console.log("ok");
        } else {
          console.log(response);
          throw new Error("Internal Server Error");
        }
      } catch (error) {
        if (error.response.data.message.includes("not authorised")) {
          navigate("/");
        }
        console.log(error);
        console.log("cannot");
      }
    }
    getProfileDetails();
  }, [refreshUser]);

  return (
    <Page title="User Management">
      <div style={{ textAlign: "right" }}>
        {/* Add Group Section */}
        <form onSubmit={handleAddGroups}>
          <div>
            <label>Add Group:</label>
            <input
              id="newGroup"
              type="text"
              name="newGroup"
              onChange={(e) => setGroup(e.target.value)}
            />

            <button className="btn btn-sm btn-success mr-2" type="submit">
              Add Group
            </button>
          </div>
        </form>

        {/* Add User Section */}
        <form onSubmit={handleAddUsers}>
          <div>
            <label>Username:</label>
            <input
              id="newUsername"
              type="text"
              name="newUsername"
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password:</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Email:</label>
            <input
              id="newEmail"
              type="text"
              name="newEmail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div></div>
            {/* <label>Group:</label> */}
            {/* <input type="text" /> */}
            <Autocomplete
              multiple
              placeholder="Select Groups"
              name="newUserGroup"
              id="newUserGroup"
              key={rerenderAC}
              // options={["Admin", "Group 1", "Group 2", "Group 3"]}
              options={groupsNames.map((group) => group.groupname)}
              getOptionLabel={(option) => option} // Specify how to get the label for an option
              // onChange={(e) => setUserGroup(e.target.value)}
              onChange={(event, newValue) => setUserGroup(newValue)}
            />
            <label>User Activity:</label>
            <select
              name="newActive"
              id="newUserGroup"
              value={newActive}
              onChange={(e) => setActive(e.target.value)}
            >
              <option value="1">Active</option>
              <option value="0">Not active</option>
            </select>
            <div></div>
            <button className="btn btn-sm btn-success mr-2" type="submit">
              Add User
            </button>
          </div>
        </form>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Groups</th>
            <th>Activity</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {allUsers &&
            allUsers.map((user) => (
              <ViewAllUsers
                user={user}
                key={user.username}
                setRefreshUser={setRefreshUser}
              />
            ))}
        </tbody>
      </table>
    </Page>
  );
}

export default UserManagementPage;
