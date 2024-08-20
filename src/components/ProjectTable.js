import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import CreateDataPage from "./CreateDataPage"; // Import CreateDataPage component
import './ProjectTable.css'; // Ensure you have this CSS file

const ProjectTable = () => {
  const [projects, setProjects] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await fetch(
          "https://5c85-103-175-108-209.ngrok-free.app/building/projectlist/",
          {
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "98547",
            },
          }
        );
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      }
    };

    fetchProjectData();
  }, []);

  // Function to render image with click event
  const renderImage = (imageUrl, name) => {
    const url = `https://5c85-103-175-108-209.ngrok-free.app/${imageUrl}`;
    return (
      <img
        src={url}
        alt={name}
        style={{ width: "100px", height: "auto", cursor: "pointer" }}
        onClick={() => navigate("/image-view", { state: { imageUrl: url, name } })}
      />
    );
  };

  // Function to handle create project button click
  const handleCreateProject = () => {
    setIsDrawerOpen(true);
  };

  // Function to handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="project-table-container">
      <div className="header-container">
        <h2>Project List</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateProject}
          className="create-project-button"
        >
          Create Project
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Image</th>
            <th>Total Floors</th>
            <th>No of Employees</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.project}</td>
              <td>{renderImage(project.image, project.project)}</td>
              <td>{project.total_floors}</td>
              <td>{project.no_of_employees}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <Box
          sx={{ width: 490, padding: 2 }}
        >
          <CreateDataPage onClose={handleDrawerClose} />
        </Box>
      </Drawer>
    </div>
  );
};

export default ProjectTable;