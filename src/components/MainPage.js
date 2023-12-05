import './MainPage.css';
import React, { useEffect, useState } from 'react';

function MainPage() {
  const [games, setGames] = useState([]);
  const [moreGames, setMoreGames] = useState([]);

  // Only changes games once upon loading.
  useEffect(() => {
    getGames();
    getMoreGames();
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
      games.forEach(function(gameId, i){
        console.log(gameId);
      });
    } catch (error) {
      console.error(error);
    }
  }

  const getMoreGames = async () => {
    try {
      // GET call to backend
      const temporaryList = [];
      for(let i = 5; i <= 8; i++) {
        console.log('http://localhost:8080/videogame-info/' + i);
        const response = await fetch(('http://localhost:8080/videogame-info/' + i), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        temporaryList.push(res);
        console.log(temporaryList);
      }
      for(let i = 10; i <= 14; i++) {
        console.log('http://localhost:8080/videogame-info/' + i);
        const response = await fetch(('http://localhost:8080/videogame-info/' + i), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        temporaryList.push(res);
        console.log(temporaryList);
      }
      for(let i = 20; i <= 25; i++) {
        console.log('http://localhost:8080/videogame-info/' + i);
        const response = await fetch(('http://localhost:8080/videogame-info/' + i), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        temporaryList.push(res);
        console.log(temporaryList);
      }
      setMoreGames(temporaryList);
      console.log(getMoreGames);
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