import './MainPage.css';
import React, { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import ReactPlayer from 'react-player'

const token = sessionStorage.getItem("jwt");

function WishList() {
  const [wishList, setWishList] = useState([]);
  const [selectedGame, setSelectedGame]= useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const token = sessionStorage.getItem("jwt");
  const history = useHistory();

  // Only changes games once upon loading.
  useEffect(() => {
    getWishList(currentPage);
  }, [currentPage, selectedGame])

  const GameModal=({game, onClose}) =>{

    const ShowHTML = (htmlText) =>{
        const html = {__html:htmlText};
        return <div dangerouslySetInnerHTML={html} />
    }
  
    const renderVideo = (trailers) => {
      if(trailers.length > 0) {
        console.log(trailers[0].data);
        return (
          <div>
            <p>Trailer: </p>
            <ReactPlayer url={trailers[0].data} controls={true} light={trailers[0].preview}/>
          </div>
        );
      }
    }
  
    const deleteGameFromWishList = async () => {
      try {
        console.log(game);
        const response = await fetch(`http://localhost:8080/delete-game/${game.id}`, {
          method: 'DELETE',
          headers: {'Authorization' : token, 'Content-Type' : 'application/json'},
        });
        if(!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        const res = await response.json();
        console.log(res);
        window.location.reload(true);
      } catch(error) {
        console.error(error);
      }
    }
  
    return(
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
          <h2>{game.name}</h2>
          <img src={selectedGame.background_image} alt={game.name} />
            <p>Release Date: {selectedGame.released}</p>
            <p>Rating: {selectedGame.rating}</p>
            <p>Avg Playtime: {selectedGame.playtime} hours</p>
            <p>Age Rating: {selectedGame.esrb_rating}</p>
            <p>Purchase Sites:
              <ul>
              {selectedGame.purchaseSites.map((data) => (
                  <li><a href={data.site}>{data.vendor}</a></li>
              ))} 
              </ul>
            </p>
            <p>Description: {ShowHTML(selectedGame.description)}</p>
            {renderVideo(selectedGame.trailers)}
            <input class='add_btn' type='submit' name='submit' value='Delete' onClick={deleteGameFromWishList}></input>
        </div>
      </div>
    );
  };

  const getGameInfo = async (gameId) => {
    try {
      // Get 20 games (first page)
      const response = await fetch(`http://localhost:8080/videogame-info/${gameId}`, {
        method: 'GET',
        headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
      });
      if(!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
      setSelectedGame(res);
    } catch(error) {
      console.error(error);
    }
  }

  const getWishList = async (page) => {
    try {
      // Get 20 games (first page)
      const response = await fetch(`http://localhost:8080/wishlist`, {
        method: 'GET',
        headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
      });
      if(!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const res = await response.json();
      console.log(res);
      setWishList(res);
    } catch(error) {
      console.error(error);
    }
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
    getGameInfo(game.gameId)
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
            <img src="./logo.png" alt="logo"></img>
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
      <h3 style={{ textAlign: 'center' }}>Saved Games</h3>
      <div className="item-cards">
        {wishList.map((data) => (
          <div key={data.id} className="item-card"> 
            <img src={data.background_image} alt={data.name} onClick={() => openModal(data)}/>
            <div className="card_text">{data.name}</div>
          </div>
        ))}
      </div>
        
      <br></br><br></br>
      <div className="center-pagination">
        <div className="pagination">
          <a class="prev-page" onClick={prevPage} disabled={currentPage === 1}>&#10094;</a>
          <span>Page {currentPage}</span>
          <a class="next-page" onClick={nextPage}>&#10095;</a>
        </div>
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
export default WishList;