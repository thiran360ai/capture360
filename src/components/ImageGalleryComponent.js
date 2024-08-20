import React, { useEffect, useState, Suspense } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

const ImageGalleryComponent = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isSplitScreen, setIsSplitScreen] = useState(false);
  const [is360View, setIs360View] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dateToIdMap, setDateToIdMap] = useState({});

  useEffect(() => {
    if (id) {
      fetchDates(id); // Fetch dates with the dynamic ID
    } else {
      console.error("ID is undefined.");
    }
  }, [id]);

  const fetchImages = async (id, date) => {
    try {
      const frameId = dateToIdMap[date];
      if (!frameId) {
        console.error("No frame ID found for the selected date.");
        return;
      }

      const response = await fetch(
        `https://5c85-103-175-108-209.ngrok-free.app/building/api/video-frames/plan/${id}/video/${frameId}/`,
        {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "98547",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const imageData = await response.json();
      if (imageData && Array.isArray(imageData)) {
        const validImages = imageData.filter(
          (image) => image && image.image
        );
        setImages(validImages);
      } else {
        console.warn("Unexpected API response structure:", imageData);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
  };

  const fetchDates = async (id) => {
    try {
      const response = await fetch(
        `https://5c85-103-175-108-209.ngrok-free.app/building/api/video-frames/plan/${id}/`,
        {
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "98547",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.video_frames) {
        const dateList = data.video_frames.map((frame) => ({
          date: frame.upload_date || "Unknown",
          frameId: frame.id
        }));

        const dateMap = {};
        dateList.forEach(({ date, frameId }) => {
          dateMap[date] = frameId;
        });

        setDates(dateList.map(({ date }) => date));
        setDateToIdMap(dateMap);

        // Automatically select the first date and fetch images
        if (dateList.length > 0) {
          const firstDate = dateList[0].date;
          setSelectedDate(firstDate);
          fetchImages(id, firstDate); // Fetch images for the first date
        }
      } else {
        console.warn("Unexpected API response structure:", data);
      }
    } catch (error) {
      console.error("Failed to fetch dates:", error);
    }
  };

  useEffect(() => {
    if (!isPaused && images.length > 0) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(intervalId);
    }
  }, [images.length, isPaused]);

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handlePause = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  const handleImageClick = () => {
    setIsPaused(true);
  };

  const renderImage = (imageObj, name) => {
    if (!imageObj || typeof imageObj !== 'object' || !imageObj.image) {
      console.warn(`Invalid image object or missing image property:`, imageObj);
      return (
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            No Image Available
          </Typography>
        </div>
      );
    }

    const url = `https://5c85-103-175-108-209.ngrok-free.app${imageObj.image}`;
    const timestamp = imageObj.timestamp || "Unknown Date";

    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
        }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <Typography
          variant="caption"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
            padding: "4px",
            zIndex: 1,
          }}
        >
          {timestamp}
        </Typography>
        <img
          key={imageObj.image}
          src={url}
          alt={name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            cursor: "default",
          }}
          onClick={handleImageClick}
          onError={(e) => {
            console.error("Image failed to load:", e.target.src);
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

  const toggleSplitScreen = () => {
    setIsSplitScreen((prev) => !prev);
  };

  const toggle360View = () => {
    setIs360View((prev) => !prev);
  };

  const renderSplitScreen = () => {
    const leftImage = images[currentIndex];
    const rightImage = images[(currentIndex + 1) % images.length];

    return (
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flex: 1, borderRight: "1px solid #ccc" }}>
          {renderImage(leftImage, "left")}
        </div>
        <div style={{ flex: 1 }}>{renderImage(rightImage, "right")}</div>
      </div>
    );
  };

  const Scene360View = () => {
    const texture = new THREE.TextureLoader().load(
      `https://5c85-103-175-108-209.ngrok-free.app${images[currentIndex].image}`
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(-1, 1);

    return (
      <Suspense fallback={null}>
        <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </Sphere>
      </Suspense>
    );
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    const threshold = 10;
    if (diff > threshold) {
      handleNext();
    } else if (diff < -threshold) {
      handlePrev();
    }
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    fetchImages(id, newDate); // Fetch images for the selected date
  };

  return (
    <div style={{ height: "100vh", width: "100%", padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          Video ID: {id ? id : "No ID available"}
        </Typography>
        <ButtonGroup>
          <Button onClick={handlePrev}>Previous</Button>
          <Button onClick={handlePause}>{isPaused ? "Play" : "Pause"}</Button>
          <Button onClick={handleNext}>Next</Button>
          <Button onClick={toggleSplitScreen}>
            {isSplitScreen ? "Normal View" : "Split Screen"}
          </Button>
          <Button onClick={toggle360View}>
            {is360View ? "Normal View" : "360° View"}
          </Button>
        </ButtonGroup>
      </div>

      <Select
        value={selectedDate}
        onChange={handleDateChange}
        displayEmpty
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        {dates.map((date) => (
          <MenuItem key={date} value={date}>
            {date}
          </MenuItem>
        ))}
      </Select>

      <div
        style={{
          height: isSplitScreen ? "calc(100% - 70px)" : "calc(100% - 150px)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        {isSplitScreen
          ? renderSplitScreen()
          : is360View
          ? (
            <Canvas>
              <Scene360View />
            </Canvas>
          ) : (
            renderImage(images[currentIndex], "single")
          )}
      </div>
    </div>
  );
};

export default ImageGalleryComponent;
