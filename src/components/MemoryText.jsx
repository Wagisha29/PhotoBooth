import React from 'react';
import './MemoryText.css';

const MemoryText = ({ memoryText, setMemoryText, onAddMemory, isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="memory-text">
            <div className="memory-text-container">
                <h1>What is your memory for today?</h1>
                <input 
                    type="text" 
                    placeholder="Enter your memory here." 
                    value={memoryText}
                    onChange={(e) => setMemoryText(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onAddMemory();
                        }
                    }}
                />
                <button onClick={onAddMemory}>Add Memory</button>
            </div>
        </div>
    )
}

export default MemoryText;