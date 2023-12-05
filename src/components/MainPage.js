import './MainPage.css';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const GameModal=({game, onClose}) =>{
  return(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{game.name}</h2>
        <img src={game.background_image} alt={game.name} />
        <p>Release Date: {game.released}</p>
        <p>Rating: {game.rating}</p>
        <p>Avg Playtime: {game.playtime}</p>
        <p>Age Rating: {game.esrb}</p>
      </div>
    </div>
  );
};

function MainPage() {
  const [games, setGames] = useState([]);
  const [moreGames, setMoreGames] = useState([]);
  const [newGames, setNewGames] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGame, setSelectedGame]= useState(null);

  const token = sessionStorage.getItem("jwt");

  // Only changes games once upon loading.
  useEffect(() => {
    getGames();
    // getMoreGames();
    getNewGames();
  }, [])

  const getGames = async () => {
    try {
      // GET call to backend
      const response = await fetch('http://localhost:8080/videogames', {
        method: 'GET',
        headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      // assign response to games list
      setGames(res);
    } catch (error) {
      console.error(error);
    }
  }

  const getNewGames = async () => {
    try {
      const response = await fetch('http://localhost:8080/videogames/10/2', {
        method: 'GET',
        headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
      });
      if(!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
      setNewGames(res);
    } catch(error) {
      console.error(error);
    }
  }

  const getMoreGames = async () => {
    try {
      // GET call to backend
      const temporaryList = [];
      for(let i = 5; i <= 8; i++) {
        const response = await fetch(('http://localhost:8080/videogame-info/' + i), {
          method: 'GET',
          headers: {'Authorization' : token, 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        temporaryList.push(res);
      }
      for(let i = 10; i <= 14; i++) {
        const response = await fetch(('http://localhost:8080/videogame-info/' + i), {
          method: 'GET',
          headers: {'Authorization' : token, 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        temporaryList.push(res);
      }
      for(let i = 20; i <= 25; i++) {
        const response = await fetch(('http://localhost:8080/videogame-info/' + i), {
          method: 'GET',
          headers: {'Authorization' : token, 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        temporaryList.push(res);
      }
      setMoreGames(temporaryList);
      console.log(getMoreGames);
    } catch (error) {
      console.error(error);
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 4) % 4);
  }

  const openModal = (game) =>{
    setSelectedGame(game);
  }

  const closeModal = () =>{
    setSelectedGame(null);
  }

  return (
    <div>
      <div class="container">
        <nav>
          <input type="checkbox" id="nav" class="hidden"></input>
          <label for="nav" class="nav-btn">
            <i></i>
            <i></i>
            <i></i>
          </label>
          <div class="logo">
            PlaceHolder
          </div>
          <div class="nav-wrapper">
            <ul>
              <li>Home</li>
              {/* <li>WishList</li> */}
              <li>About</li>
              {/* <li>LogOut</li> */}
            </ul>
          </div>
        </nav>
      </div>
      <br></br><br></br><hr></hr><br></br><br></br>
      <h2 style={{ textAlign: 'center' }}>Featured Games</h2>
      <div class="slideshow-container">
        {games.slice(0,4).map((data, index) => {
          return(
            <div 
              key={data.id} 
              className={`slides ${index === currentSlide ? 'active' : '' } fade`} 
              onClick={() => openModal(data)}
            >
            <img src={data.background_image} alt={`Game ${index + 1}` } />
            <div class="text">{data.name}</div>
          </div>
          )
        })}
        <a class="prev" onClick={prevSlide}>&#10094;</a>
        <a class="next" onClick={nextSlide}>&#10095;</a>
      </div>
      <br></br><br></br><hr className="styled-hr"></hr><br></br><br></br>
      <h3 style={{ textAlign: 'center' }}>Other Games</h3>
      <div className="item-cards">
        {games.slice(4,10).map((data) => (
          <div key={data.id} className="item-card" onClick={() => openModal(data)}>
            <img src={data.background_image} alt={data.name} />
            <div className="card_text">{data.name}</div>
          </div>
        ))}
      </div>
      {/* Render modal */}
      <Modal
        isOpen={selectedGame !== null}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedGame && <GameModal game={selectedGame} onClose={closeModal}/>}
      </Modal>
    </div>
  );
}
export default MainPage;