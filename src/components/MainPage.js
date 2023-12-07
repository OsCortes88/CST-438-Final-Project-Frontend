import './MainPage.css';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Modal from 'react-modal';

const GameModal=({game, onClose}) =>{

  const addGameToWishList = async () => {
    try {
      console.log(game);
      const response = await fetch(`http://localhost:8080/add-game/${game.id}`, {
        method: 'PUT',
        headers: {'Authorization' : token, 'Content-Type' : 'application/json'},
        body: JSON.stringify(game)
      });
      if(!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
    } catch(error) {
      console.error(error);
    }
  }

  return(
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{game.name}</h2>
        <img src={game.background_image} alt={game.name} />
        <p>Release Date: {game.released}</p>
        <p>Rating: {game.rating}</p>
        <p>Avg Playtime: {game.playtime} hours</p>
        <p>Age Rating: {game.esrb_rating}</p>
        <input id='submit_btn' type='submit' name='submit' value='Add' onClick={addGameToWishList}></input>
      </div>
    </div>
  );
};

const token = sessionStorage.getItem("jwt");

// Grabbing URL parameters
// const urlParams = new URLSearchParams(window.location.search);
// const pageNumber = urlParams.get('page');
// console.log(pageNumber);

function MainPage() {
  const [games, setGames] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGame, setSelectedGame]= useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const token = sessionStorage.getItem("jwt");
  const history = useHistory();

  // Only changes games once upon loading.
  useEffect(() => {
    getGames(currentPage);
  }, [currentPage])

  const getGames = async (page) => {
    try {
      // Get 20 games (first page)
      const response = await fetch(`http://localhost:8080/videogames/20/${page}`, {
        method: 'GET',
        headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
      });
      if(!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
      setGames(res);
    } catch(error) {
      console.error(error);
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);
  }

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + 4) % 4);
  }

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const openModal = (game) =>{
    setSelectedGame(game);
  }

  const closeModal = () =>{
    setSelectedGame(null);
  }

  const logout = () => {
    sessionStorage.removeItem('jwt');
    history.push('/');
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
              <li><a href="/mainpage">Home</a></li>
              <li><a href="/wishlist">WishList</a></li>
              <li><a href="/" onclick={logout}>LogOut</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <br></br><br></br><hr></hr><br></br><br></br>
      {currentPage === 1 && (
        <div>
          <h2 style={{ textAlign: 'center' }}>Featured Games</h2>
          <div class="slideshow-container">
            {games.slice(0,5).map((data, index) => {
              return(
                <div key={data.id} className={`slides ${index === currentSlide ? 'active' : '' } fade` } >
                <img src={data.background_image} alt={`Game ${index + 1}` } onClick={() => openModal(data)}/>
                <div class="text">{data.name}</div>
              </div>
              )
            })}
            <a class="prev" onClick={prevSlide}>&#10094;</a>
            <a class="next" onClick={nextSlide}>&#10095;</a>
          </div>
          <br></br><br></br><hr className="styled-hr"></hr><br></br><br></br>
        </div>
      )}
      <h3 style={{ textAlign: 'center' }}>Other Games</h3>
      <div className="item-cards">
        {games.slice(4,20).map((data) => (
          <div key={data.id} className="item-card"> 
            <img src={data.background_image} alt={data.name} onClick={() => openModal(data)}/>
            <div className="card_text">{data.name}</div>
          </div>
        ))}
      </div>
        
      <br></br><br></br>
      <div className="pagination">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous Page</button>
        <span>Page {currentPage}</span>
        <button onClick={nextPage}>Next Page</button>
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