import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

const GAMES_PER_PAGE = 4;
const MAX_PAGES = 5;

function Core(){
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const { addItem } = useCart();

    const fetchData = async()=>{
        const response = await axios.get("http://localhost:3000");
        setItems(response.data);
        console.log(response.data);
    }

    useEffect(()=>{
        fetchData();
    },[]);

    const pageCount = Math.min(MAX_PAGES, Math.ceil(items.length / GAMES_PER_PAGE));
    const visibleGames = items.slice((page - 1) * GAMES_PER_PAGE, page * GAMES_PER_PAGE);

    return <main className="games-page">
        <h1>Games</h1>
        <ul className="games-grid">
            {
            visibleGames.map((game,index)=>(
                <li className="game-card" key={game.id ?? game.title ?? index}>
                    <Link
                        className="game-card-image-link"
                        to={{
                            pathname: '/game',
                            search: `?${new URLSearchParams({ title: game.title }).toString()}`,
                        }}
                        state={{ game }}
                        aria-label={`View ${game.title}`}
                    >
                        <img src={game.imagePath} alt={game.title} />
                    </Link>
                    <h2>{game.title}</h2>
                    <p>{game.price}</p>
                    <button
                        className="add-to-cart"
                        type="button"
                        onClick={() => addItem(game)}
                    >
                        Add to cart
                    </button>
                </li>
            ))    
            }
        </ul>
        {pageCount > 1 && (
            <div className="games-pagination" aria-label="Game pages">
                {page > 1 && (
                    <button
                        type="button"
                        onClick={() => setPage((currentPage) => currentPage - 1)}
                        aria-label="Previous games"
                    >
                        &larr;
                    </button>
                )}
                <span aria-live="polite">Page {page} of {pageCount}</span>
                {page < pageCount && (
                    <button
                        type="button"
                        onClick={() => setPage((currentPage) => currentPage + 1)}
                        aria-label="Next games"
                    >
                        &rarr;
                    </button>
                )}
            </div>
        )}
    </main>
}

export default Core