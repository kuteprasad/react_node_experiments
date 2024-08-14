import React, { useState } from 'react';

function App() {
  const [meetLink, setMeetLink] = useState('');

  const createMeet = async () => {
    const response = await fetch('http://localhost:3000/create-meet', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setMeetLink(data.meetLink);
  };

  return (
    <div>
      <button onClick={createMeet}>Create Google Meet Link</button>
      {meetLink && (
        <div>
          <p>Meet Link: {meetLink}</p>
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            <button>Join Now</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
