import React, { useState, useContext, useEffect } from "react";
import Autocomplete from "@mui/joy/Autocomplete";
import Stack from "@mui/joy/Stack";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import GlobalContext from "./GlobalContext";

function ViewAllUsers({ user, setRefreshUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groupname, setGroupname] = useState([]);
  const [isactive, setActive] = useState("");
  const { setIsAdmin } = useContext(GlobalContext);

  //all groups

  const [groupsNames, setAllGroupsNames] = useState([]);
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setUsername(user.username);
    setEmail(user.email);
    setPassword("");
    setIsEditing(true);
    setActive(user.isactive);
    console.log(user.groupname);
    if (user.groupname == null || user.groupname == "") {
      setGroupname(undefined);
    } else {
      setGroupname(user.groupname.split(", "));
    }
  };

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

  async function handleSave(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/users/update", {
        username123: user.username,
        password,
        email,
        groupname,
        isactive,
      });
      console.log(response);
      if (response.data) {
        console.log(response.data);
        setIsEditing(false);
        setEmail("");
        setRefreshUser((prev) => prev + 1);
        toast.success("User details updated successfully!", {
          autoClose: 700,
        });
      } else {
        console.log(response.data.message);
        throw new Error(response.data.message);
      }
    } catch (error) {
      setIsAdmin(false);
      if (error.response.data.message.includes("not authorised")) {
        navigate("/");
      }
      console.log(error);
    }
  }

  return (
    <tr key={user.username}>
      <td>
        {isEditing ? (
          <input type="text" value={username} readOnly />
        ) : (
          user.username
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          "********"
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          user.email
        )}
      </td>
      <td>
        {isEditing ? (
          <Autocomplete
            multiple
            placeholder="Groups"
            onChange={(e, newValue) => setGroupname(newValue)}
            // options={["Admin", "Group 1", "Group 2", "Group 3"]}
            options={groupsNames.map((group) => group.groupname)}
            value={groupname}
            getOptionLabel={(option) => option} // Specify how to get the label for an option
          />
        ) : (
          user.groupname
        )}
        {/* <select>
            <option value=""></option>
        </select> */}
      </td>
      <td>
        {/* {user.isactive == "1" ? (
          <button
            className="btn btn-sm btn-secondary"
            //   defaultValue={active}
          >
            Enable
          </button>
        ) : (
          <button className="btn btn-sm btn-secondary">Disable</button>
        )} */}
        {/* {user.isactive == "1" ? (
          <button
            className="btn btn-sm btn-secondary"
            //   defaultValue={active}
          >
            Enable
          </button>
        ) : (
            <select name="userActive">
                <option value="1">Enable</option>
                <option value="0">Disable</option>
            </select>
          )} */}
        {isEditing ? (
          user.isactive == "1" ? (
            <select
              name="userActive"
              value={isactive}
              onChange={(e) => setActive(e.target.value)}
            >
              <option value="1">Active</option>
              <option value="0">Not Active</option>
            </select>
          ) : (
            <select
              name="userNotActive"
              value={isactive}
              onChange={(e) => setActive(e.target.value)}
            >
              <option value="0">Not Active</option>
              <option value="1">Active</option>
            </select>
          )
        ) : user.isactive == "1" ? (
          // <input type="text" value="Active" readOnly/>
          <p>Active</p>
        ) : (
          <p>Not Active</p>
        )}
      </td>
      {/* <td>
        {isEditing ? <button onClick={handleSave} className="btn btn-sm btn-secondary">
          Save
        </button> :  <button onClick={handleEdit} className="btn btn-sm btn-secondary">
          Edit
        </button>} 
        
      </td> */}
      {isEditing ? (
        <td>
          <button onClick={handleSave} className="btn btn-sm btn-secondary">
            Save
          </button>
          &nbsp;&nbsp;&nbsp;
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-sm btn-secondary"
          >
            Cancel
          </button>
        </td>
      ) : (
        <td>
          <button onClick={handleEdit} className="btn btn-sm btn-secondary">
            Edit
          </button>
        </td>
      )}
    </tr>
  );
}

export default ViewAllUsers;
