import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CreatePlanDataPage from "./CreatePlanDataPage";

const PlanDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, data } = location.state || {};

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleViewPlan = async (id) => {
    navigate("/image-gallery", {
      state: {
        id,
      },
    });
  };

  const renderImage = (imageUrl, name) => {
    const fullImageUrl = `https://5c85-103-175-108-209.ngrok-free.app/${imageUrl}`;
    return (
      <img
        src={fullImageUrl}
        alt={name}
        style={{ width: "100px", height: "auto", cursor: "pointer" }}
        onClick={() => navigate("/image-gallery", { state: { id: name } })}
      />
    );
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom style={{ color: "#00509e",fontWeight:'bold',paddingLeft: '20px' }}>
        {title}
      </Typography>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleDrawer(true)}
          style={{color: "#ffffff", margin: "10px 0", borderRadius: 4, marginLeft: '70%',width: '180px' }}
        >
          Create Plan
        </Button>
      </Box>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ width: 400, padding: "20px" }}>
          <CreatePlanDataPage />
        </div>
      </Drawer>
      {data ? (
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(data[0]).map((key, index) => (
                <TableCell key={index} style={{ color: "#00509e",fontWeight:'bold',paddingLeft: '20px' }}>{key}</TableCell>
              ))}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {Object.entries(row).map(([key, value], idx) => (
                  <TableCell key={idx}>
                    {typeof value === "string" && value.includes("/media/")
                      ? renderImage(value, key)
                      : value}
                  </TableCell>
                ))}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewPlan(row.id)}
                    style={{ width: '250px'}}
                  >
                    View 360°
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Typography>No plan details available.</Typography>
      )}
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          style={{ width: '250px' }}
        >
          Back to Project List
        </Button>
      </Box>
    </Box>
  );
};

export default PlanDetailsPage;