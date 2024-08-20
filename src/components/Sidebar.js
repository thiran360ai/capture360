import React from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProjectIcon from '@mui/icons-material/Assignment';
import CreateIcon from '@mui/icons-material/AddCircle';
import './sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const styles = {
    drawer: {
      width: isOpen ? '240px' : '0',
      transition: 'width 0.3s ease',
      height: '100%',
      top: 0,
      position: 'fixed',
      backgroundColor: '#f8f9fa',
      overflowX: 'hidden',
    },
    toggleButton: {
      position: 'absolute', // Change from 'fixed' to 'absolute'
      top: '10px',
      left: isOpen ? '240px' : '0',
      zIndex: 1300,
      transition: 'left 0.3s ease',
    },
    toggleButtonWrapper: {
      position: 'fixed', // Keeps the wrapper fixed
      top: '10px',
      left: '0',
      zIndex: 1301, // Higher zIndex to ensure it stays above other elements
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/' },
    {
      text: 'Project Manager',
      icon: <ProjectIcon />,
      link: '/project-manager',
      apiEndpoint: 'https://5c85-103-175-108-209.ngrok-free.app/building/projectlist/',
    },
    {
      text: 'Create Manager',
      icon: <CreateIcon />,
      link: '/create-manager',
      apiEndpoint: 'https://5c85-103-175-108-209.ngrok-free.app/building/create_user/',
    },
  ];

  const navigate = useNavigate();

  const handleNavigation = (link, apiEndpoint) => {
    navigate(link, { state: { apiEndpoint, title: link === '/create-manager' ? 'Create Manager' : 'Project Manager' } });
  };

  return (
    <>
      <div style={styles.toggleButtonWrapper}>
        <IconButton
          style={styles.toggleButton}
          onClick={toggleSidebar}
        >
          {isOpen ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </IconButton>
      </div>
      
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        PaperProps={{ style: styles.drawer, className: 'sidebar-paper' }}
      >
        <List className="sidebar-list">
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.link, item.apiEndpoint)}
              className="sidebar-list-item"
            >
              <ListItemIcon className="sidebar-list-item-icon">{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} className="sidebar-list-text" />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;