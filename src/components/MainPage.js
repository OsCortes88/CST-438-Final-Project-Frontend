import './MainPage.css';
import React, { useEffect, useState } from 'react';

function MainPage() {
  const [games, setGames] = useState([]);

  // Only changes games once upon loading.
  useEffect(() => {
    getGames();
  }, [])

  const getGames = async () => {
    try {
      // GET call to backend
      const response = await fetch('http://localhost:8080/videogames', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
      // assign response to games list
      setGames(res);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h1>Main Page</h1>
      <ol>
        {/* display data */}
        {games.map((data) => {
          return(
            <li key={data.id}>{data.name}</li>
          )
        })}
      </ol>
    </div>
  );
}
export default MainPage;