import React from 'react';
import './MemoryText.css';

const MemoryText = ({ memoryText, setMemoryText, onAddMemory, isVisible }) => {
    if (!isVisible) return null;

    const maxLength = 60;
    const remainingChars = maxLength - memoryText.length;

    return (
        <div className="memory-text">
            <div className="memory-text-container">
                <h1>What is your memory for today?</h1>
                <input 
                    type="text" 
                    placeholder="Enter your memory here." 
                    value={memoryText}
                    onChange={(e) => {
                        if (e.target.value.length <= maxLength) {
                            setMemoryText(e.target.value);
                        }
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onAddMemory();
                        }
                    }}
                    maxLength={maxLength}
                />
                <div className="char-counter">
                    {remainingChars} characters remaining
                </div>
                <button onClick={onAddMemory}>Add Memory</button>
            </div>
        </div>
    )
}

export default MemoryText;