import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import CreateDataPage from "./CreateDataPage";
import { Box, Card, CardContent } from "@mui/material";
import "./DataPage.css";

const DataPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, apiEndpoint } = location.state || {};
  const [fetchedData, setFetchedData] = useState(null);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  useEffect(() => {
    if (apiEndpoint) {
      const fetchData = async () => {
        try {
          const response = await fetch(apiEndpoint, {
            headers: {
              Accept: "application/json",
              "ngrok-skip-browser-warning": "98547",
            },
          });
          const jsonData = await response.json();
          setFetchedData(jsonData);
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      };
      fetchData();
    }
  }, [apiEndpoint]);

  const handleView = async (row) => {
    if (!row.project) {
      console.error("Project ID is missing:", row);
      return;
    }

    try {
      const viewUrl = `https://5c85-103-175-108-209.ngrok-free.app/building/plans/project/${row.project}/`;
      const response = await fetch(viewUrl, {
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "98547",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      navigate("/plan-details", {
        state: { title: `Plan Details for Project ${row.project}`, data },
      });
    } catch (error) {
      console.error("Failed to fetch view data:", error);
    }
  };

  const renderImage = (imageUrl, name) => {
    const url = `https://5c85-103-175-108-209.ngrok-free.app/${imageUrl}`;
    return (
      <img
        src={url}
        alt={name}
        style={{ width: "100px", height: "auto", cursor: "pointer" }}
        onClick={() =>
          navigate("/image-view", { state: { imageUrl: url, name } })
        }
      />
    );
  };

  const openCreateDrawer = () => {
    setIsCreateDrawerOpen(true);
  };

  const closeCreateDrawer = () => {
    setIsCreateDrawerOpen(false);
  };

  return (
    <Card style={{width: '1100px',height:'650px' ,boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)', paddingTop: '20px', overflow: 'auto',
      // backgroundColor: '#eceff1'
    }}>
      <CardContent style={{}}>
        <Typography variant="h4" gutterBottom style={{ color: "#00509e",fontWeight:'bold',paddingLeft: '20px' }}>
          {title}
        </Typography>
        <Box
          className="button-container"
          style={{ marginLeft: "80%", justifyContent: "flex-end" }}
        >
          <Button variant="contained" color="primary" onClick={openCreateDrawer}  
          style={{color: "#ffffff", margin: "10px 0", borderRadius: 4 }}>
            Create project
          </Button>
        </Box>

        {fetchedData ? (
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(fetchedData[0]).map((key, index) => (
                  <TableCell key={index} style={{ fontSize: '20px', fontWeight: 'bold' }}>{key}</TableCell>
                ))}
                <TableCell style={{ fontSize: '20px', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fetchedData.map((row, index) => (
                <TableRow key={index}>
                  {Object.entries(row).map(([key, value], idx) => (
                    <TableCell key={idx} style={{ fontSize: '18px', }}>
                      {key === "image"
                        ? renderImage(value, row.name)
                        : value}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleView(row)}
                      style={{ width: "180px", color: "#ffffff", margin: "10px 0", borderRadius: 9 }}
                    >
                      View Floor_Data
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1">Loading...</Typography>
        )}
        <Drawer anchor="right" open={isCreateDrawerOpen} onClose={closeCreateDrawer}>
          <CreateDataPage onClose={closeCreateDrawer} />
        </Drawer>
      </CardContent>
    </Card>
  );
};

export default DataPage;
