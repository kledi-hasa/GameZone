import './App.css'
import Navbar from './components/Navbar.tsx'
import GameBanner from "./components/GameBanner.tsx";

function App() {


  return (
    <>
      <div>
        <Navbar/>
       
      </div>
      <GameBanner
        title="Elden Ring"
        releaseDate="February 25, 2022"
        rating={5}
        description="An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses."
        backgroundImage="https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg"
        price= {39.99}
        onPlayTrailer={() => alert("Playing trailer...")}
        onAddToWishlist={() => alert("Added to wishlist!")}
        onAddToCart={() => alert("Added to Cart!")}
      />
      <GameBanner title={'GTA V'} releaseDate={'2013'} rating={9} description={'An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses.'} backgroundImage={'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg'} onPlayTrailer={() => alert("Playing trailer...")}
        onAddToWishlist={() => alert("Added to wishlist!")} price={39.99} onAddToCart={() => alert("Added to Cart!")}/>
        <GameBanner title={'GTA V'} releaseDate={'2013'} rating={9} description={'An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses.'} backgroundImage={'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg'} onPlayTrailer={() => alert("Playing trailer...")}
        onAddToWishlist={() => alert("Added to wishlist!")} price={39.99} onAddToCart={() => alert("Added to Cart!")}/>
        <GameBanner title={'GTA V'} releaseDate={'2013'} rating={9} description={'An expansive open-world action RPG where you explore the Lands Between, uncover mysteries, and face epic bosses.'} backgroundImage={'https://media.rawg.io/media/games/456/456dea5e1c7e3cd07060c14e96612001.jpg'} onPlayTrailer={() => alert("Playing trailer...")}
        onAddToWishlist={() => alert("Added to wishlist!")} price={39.99} onAddToCart={() => alert("Added to Cart!")}/>
    </>
  )
}

export default App
