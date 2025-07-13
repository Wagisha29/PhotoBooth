import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import './PhotoStudio.css';
import MemoryText from './MemoryText';

const filters = [
    "90s",
    "2000s",
    "Noir",
    "Fisheye",
    "Rainbow",
    "Glitch",
    "Crosshatch",
]


const PhotoStudio = () => {

    const [showResult, setShowResult] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState("90s");
    const [isCapturing, setIsCapturing] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [showFlash, setShowFlash] = useState(false);
    const [showMemoryInput, setShowMemoryInput] = useState(false);
    const [memoryText, setMemoryText] = useState("");
    const [finalMemoryText, setFinalMemoryText] = useState("");
    const webcamRef = useRef(null);

    // Helper function to wait for a specific time
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getFilterClass = (filter) => {
        switch (filter.toLowerCase()) {
          case "90s":
            return "_90s";
          case "2000s":
            return "_2000s";
          default:
            return filter.toLowerCase();
        }
      };

    const takePhoto = async () => {
        const video = webcamRef.current?.video;
        if (!video || video.readyState < 2) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");

        let cssFilter = "none";
        switch(selectedFilter.toLowerCase()){
            case "noir":
                cssFilter = "contrast(1.1) sepia(0.3) hue-rotate(-10deg) saturate(0.8) brightness(1.1)";
                break;
            case "2000s":
                cssFilter = "saturate(1.8) contrast(1.05) brightness(1.1) sepia(0.1) hue-rotate(10deg)";
                break;
            case "rainbow":
                cssFilter = "hue-rotate(90deg)";
                break;
            case "glitch":
                cssFilter = "contrast(1.5) saturate(2)";
                break;
            case "crosshatch":
                cssFilter = "grayscale(0.5) blur(1px)";
                break;
            case "fisheye":
                cssFilter = "brightness(1.1)";
                break;
        }

        ctx.filter = cssFilter;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const filteredImg = canvas.toDataURL("image/jpeg");
        setPhotos((prev) => [
            ...prev,
            { src: filteredImg, filter: selectedFilter },
          ]);
        };

    const triggerFlash = async () => {
        setShowFlash(true);
        await delay(200); // Flash duration
        setShowFlash(false);
    };

    const countdownStep = async (value) => {
        setCountdown(value);
        await new Promise((r) => requestAnimationFrame(r));
         await delay(1000);
    }

    const startPhotoSequence = async () => {
        setIsCapturing(true);
        setPhotos([]);
        setShowResult(false);
        setShowMemoryInput(false);
        setMemoryText("");
        setFinalMemoryText("");

        for(let i = 0; i < 3; i++){
            await countdownStep("3");
            await countdownStep("2");
            await countdownStep("1");
            await countdownStep("Smile!");
            await takePhoto();
            await triggerFlash(); // Trigger flash after photo capture
            setCountdown(null);
            await delay(500);
        }
        setIsCapturing(false);
        setShowMemoryInput(true); // Show memory input after photos are taken
    }

    const handleAddMemory = () => {
        if (memoryText.trim()) {
            setFinalMemoryText(memoryText.trim());
            setShowMemoryInput(false);
            setShowResult(true);
        }
    }

    const handleReshoot = () => {
        setPhotos([]);
        setShowResult(false);
        setShowMemoryInput(false);
        setMemoryText("");
        setFinalMemoryText("");
    }

    const handleDownload = async () => {
        const frame = document.getElementById("photostrip-canvas-source");
        if (!frame) return;

        const canvas = await html2canvas(frame, {useCORS: true});
        const dataURL = canvas.toDataURL("image/jpeg");

        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "wagisha-booth-strip.jpg";
        link.click();

    }

    return (
        <div className='photostudio'>
            {!showResult && !showMemoryInput && (
                <div className="studio-container">
                    <div className="studio-webcam">
                        {countdown && <div className="countdown-overlay">{countdown}</div>}
                        {showFlash && <div className="flash-overlay"></div>}

                        <Webcam 
                            ref={webcamRef}
                            className={`webcam-view ${getFilterClass(selectedFilter)}`}
                            screenshotFormat="image/jpeg"
                            audio={false}
                        />
                    </div>
                    <div className="filter-bar">
                        {filters.map((filter) => (
                            <button 
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`filter-btn ${
                                    selectedFilter === filter ? "active" : ""
                                  }`}
                                disabled={isCapturing}
                            >
                            {filter}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={startPhotoSequence} 
                        disabled={isCapturing}
                        className="capture-btn"
                    >
                        📸
                    </button>
                </div>
            )}  

            <MemoryText 
                memoryText={memoryText}
                setMemoryText={setMemoryText}
                onAddMemory={handleAddMemory}
                isVisible={showMemoryInput}
            />

            {showResult && (
                <div className="studio-result slide-in-top">
                    <div 
                        className={`photostrip-frame ${showResult ? "strip-slide-in" : ""}`} 
                        id="photostrip-canvas-source"
                    >
                        {photos.map((photo, index) => (
                            <div key={index} className="strip-photo-wrapper">
                                <img 
                                    src={photo.src} 
                                    alt={`snap-${index}`}  
                                    className={`strip-photo-img ${getFilterClass(photo.filter)}`} 
                                />
                            </div>
                        ))}

                        {finalMemoryText && (
                            <p className="memory-caption">
                                "{finalMemoryText}"
                            </p>
                        )}
                        
                        <p className="photostrip-caption">
                            Wagisha Photo Booth •{" "}
                            {new Date().toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="result-controls">
                        <button className="reshoot" onClick={handleReshoot}>
                            Reshoot
                        </button>
                        <button className="download" onClick={handleDownload}>
                            Download Strip
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoStudio;