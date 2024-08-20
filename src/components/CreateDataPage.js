import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const CreateDataPage = ({ onClose }) => {
  const [project, setProjectId] = useState("");
  const [image, setImage] = useState(null);
  const [totalFloors, setTotalFloors] = useState("");
  const [noOfEmployees, setNoOfEmployees] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("project", project);
    formData.append("image", image);
    formData.append("total_floors", totalFloors);
    formData.append("no_of_employees", noOfEmployees);
    formData.append("description", description);

    try {
      const response = await fetch("https://5c85-103-175-108-209.ngrok-free.app/building/create_project_list/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        setMessage("Successfully submitted");
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
          onClose();
          navigate("/"); // Redirect after 3 seconds
        }, 3000);
      } else {
        setMessage("Failed to submit");
        setOpen(true);
      }
    } catch (error) {
      setMessage("Error submitting data");
      setOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  return (
    <Card style={{ maxWidth: 1000, margin: "auto", marginTop: 30 ,}}>
      <CardContent style={{width: '450px',boxShadow: "0 8px 16px rgba(0,0,0,0.2)",backgroundColor:'#efebe9',borderRadius: 8}}>
        <Typography variant="h6" gutterBottom style={{ marginBottom: 30,textAlign: "center", 
          fontSize: '28px',}}> <span style={{ textDecoration: 'underline', color: 'GrayText' }}>
          Create Project List Data
          </span>
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <TextField
            label="Project"
            value={project}
            onChange={(e) => setProjectId(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: "#ffffff", borderRadius: 4 }}
            size="small"
          />
          <TextField
            label="Total Floors"
            value={totalFloors}
            onChange={(e) => setTotalFloors(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: "#ffffff", borderRadius: 4 }}
            size="small"
          />
          <TextField
            label="Number of Employees"
            value={noOfEmployees}
            onChange={(e) => setNoOfEmployees(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: "#ffffff", borderRadius: 4 }}
            size="small"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
            style={{ backgroundColor: "#ffffff", borderRadius: 4 }}
            size="small"
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
          <label htmlFor="upload-image">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{color: "#ffffff", margin: "10px 0", borderRadius: 4 }}
              size="small"
            >
              Upload Image
            </Button>
          </label>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{color: "#ffffff", margin: "10px 0", borderRadius: 4 }}
            size="small"
          >
            Submit
          </Button>
        </form>
      </CardContent>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseSnackbar} style={{ bottom: 50 }}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={message === "Successfully submitted" ? "success" : "error"}
        >
          {message}
        </MuiAlert>
      </Snackbar>
    </Card>
  );
};

export default CreateDataPage;
