import './MainPage.css';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SelectButton } from 'primereact/selectbutton';
import Modal from 'react-modal';
import ReactPlayer from 'react-player'

// Genres for Select Buttons
const allGenres = [
  { name: 'Action', value: 'action' },
  { name: 'Indie', value: 'indie' },
  { name: 'Adventure', value: 'adventure' },
  { name: 'RPG', value: 'role-playing-games-rpg'},
  { name: 'Strategy', value: 'strategy' },
  { name: 'Shooter', value: 'shooter' },
  { name: 'Casual', value: 'casual' },
  { name: 'Simulation', value: 'simulation' },
  { name: 'Puzzle', value: 'puzzle' },
  { name: 'Arcade', value: 'arcade' },
  { name: 'Platformer', value: 'platformer' },
  { name: 'Multiplayer', value: 'massively-multiplayer' },
  { name: 'Racing', value: 'racing' },
  { name: 'Sports', value: 'sports' },
  { name: 'Fighting', value: 'fighting' },
  { name: 'Family', value: 'family' },
  { name: 'Board-Games', value: 'board-games' },
  { name: 'Educational', value: 'educational' },
  { name: 'Card', value: 'card' }
];


const Sidebar = ({ genresSelected, setGenresSelected, handleFilter, handleResetFilters }) => {
  return (
    <div className="sidebar-container">
      <label htmlFor="nav" className="nav-btn">
        <i></i>
        <i></i>
        <i></i>
      </label>
      <div className="sidebar">
        <h3>Filter By Genre</h3>
        <div className="card flex justify-content-center">
          <SelectButton
            value={genresSelected}
            onChange={(e) => setGenresSelected(e.value)}
            optionLabel="name"
            options={allGenres}
            multiple
            className="custom-select-button"
          />
        </div>
        <input className='filter_btn' type="submit" name="submit" value="Filter" onClick={handleFilter} />
      </div>
    </div>
  );
};

const token = sessionStorage.getItem("jwt");

function MainPage() {
  const [games, setGames] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedGame, setSelectedGame]= useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [genresSelected, setGenresSelected] = useState([]);

  const token = sessionStorage.getItem("jwt");
  const history = useHistory();

  // Only changes games once upon loading.
  useEffect(() => {
    document.title = "Gamestore - Main Page";
    getGames(currentPage);
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
          <h2>{selectedGame.name}</h2>
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
          <input id={selectedGame.id} class='add_btn' type='submit' name='submit' value='Add' onClick={addGameToWishList}></input>
        </div>
      </div>
    );
  };


  const getGames = async (page) => {
    if(genresSelected.length != 0) {
      console.log(genresSelected);
      try {
        const filteredResponse = await fetch(`http://localhost:8080/videogames-by-genre/20/${page}/${genresSelected}`, {
          method: 'GET',
          headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
        });
        if(!filteredResponse.ok) {
          throw new Error(`Failed to fetch data: ${filteredResponse.status}`);
        }
        const res = await filteredResponse.json();
        console.log(res);
        setGames(res);
      }
      catch(error) {
        console.error(error);
      }
    }
    else {
      try {
        const normalResponse = await fetch(`http://localhost:8080/videogames/20/${page}`, {
            method: 'GET',
            headers: {'Authorization' : token, 'Content-Type' : 'application/json'}
          });
        if(!normalResponse.ok) {
          throw new Error(`Failed to fetch data: ${normalResponse.status}`);
        }
        const res = await normalResponse.json();
        console.log(res);
        setGames(res);
      } catch(error) {
        console.error(error);
      }
    }
  }

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
    getGameInfo(game.id);
  }

  const closeModal = () =>{
    setSelectedGame(null);
  }

  const logout = () => {
    sessionStorage.removeItem('jwt');
    history.push('/');
  }

  const handleFilter = (e) => {
    e.preventDefault();
    getGames(1);
  }
  
  return (
    <div className='container'>
      <div className='sidebar-container'>
        <Sidebar genresSelected={genresSelected} setGenresSelected={setGenresSelected} handleFilter={handleFilter} />
      </div>
      <div class="game-container">
        <nav>
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
              <li><a class="nav-link" href="/mainpage">Home</a></li>
              <li><a id="wishlistLink" class="nav-link" href="/wishlist">WishList</a></li>
              <li><a id="logoutLink" class="nav-link" href="/" onclick={logout}>LogOut</a></li>
            </ul>
          </div>
        </nav>
      </div>
      <br></br><br></br><hr></hr><br></br><br></br>
      {currentPage === 1 && (
        <div>
          <h2>Featured Games</h2>
          <div class="slideshow-container">
            {games.slice(0,5).map((data, index) => {
              const uniqueId = `img${data.id}`;
              return(
                <div key={data.id} className={`slides ${index === currentSlide ? 'active' : '' } fade` } >
                <img id={uniqueId} src={data.background_image} alt={`Game ${index + 1}` } onClick={() => openModal(data)}/>
                <div class="text">{data.name}</div>
              </div>
              )
            })}
            <a class="prev" onClick={prevSlide}>&#10094;</a>
            <a class="next" onClick={nextSlide}>&#10095;</a>
          </div>
          <br></br><br></br><hr className="styled-hr"></hr><br></br><br></br>
          <h3>Other Games</h3>
          <div className="item-cards">
            {games.slice(4,20).map((data) => (
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
          </div>
        )}

        {currentPage !== 1 && (
          <div>
            <h3>Other Games</h3>
            <div className="item-cards">
              {games.map((data) => (
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
          </div>
        )}

        <br></br><br></br>

      {/* </div> */}
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