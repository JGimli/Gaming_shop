import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from './CartContext.jsx';

const API_URL = 'http://localhost:3000';

export function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const searchTerm = query.trim();
        if (!searchTerm) {
            return undefined;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(async () => {
            setStatus('loading');
            try {
                const response = await axios.get(`${API_URL}/search`, {
                    params: { title: searchTerm },
                    signal: controller.signal,
                });
                setResults(response.data);
                setStatus('done');
                setError('');
            } catch (requestError) {
                if (!axios.isCancel(requestError)) {
                    console.error(requestError);
                    setResults([]);
                    setStatus('done');
                    setError('Could not search games. Please try again.');
                }
            }
        }, 250);

        return () => {
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, [query]);

    const openGame = (game) => {
        const search = new URLSearchParams({ title: game.title }).toString();
        navigate({ pathname: '/game', search }, { state: { game } });
        setQuery('');
        setResults([]);
        setStatus('idle');
        setError('');
    };

    const handleQueryChange = (event) => {
        const nextQuery = event.target.value;
        setQuery(nextQuery);
        setResults([]);
        setStatus(nextQuery.trim() ? 'loading' : 'idle');
        setError('');
    };

    return (
        <div className="search-container">
            <label className="visually-hidden" htmlFor="game-search">Search games</label>
            <input
                id="game-search"
                type="search"
                placeholder="Search games..."
                value={query}
                onChange={handleQueryChange}
                autoComplete="off"
                aria-controls="game-search-results"
                aria-expanded={Boolean(query.trim()) && status !== 'idle'}
            />
            {query.trim() && status !== 'idle' && (
                <ul id="game-search-results" className="search-results" role="listbox">
                    {status === 'loading' ? (
                        <li className="search-message" role="status">Searching...</li>
                    ) : error ? (
                        <li className="search-message" role="status">{error}</li>
                    ) : results.length === 0 ? (
                        <li className="search-message" role="status">No games found.</li>
                    ) : results.map((game) => (
                        <li key={game.id ?? game.title}>
                            <button
                                type="button"
                                role="option"
                                aria-selected="false"
                                onClick={() => openGame(game)}
                            >
                                {game.title}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export function GamePage() {
    const { addItem } = useCart();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const title = searchParams.get('title') ?? '';
    const [loadedGame, setLoadedGame] = useState({ title: '', game: null, error: '' });
    const selectedGame = location.state?.game;
    const hasSelectedGame = selectedGame
        && selectedGame.title.toLowerCase() === title.toLowerCase();

    useEffect(() => {
        if (hasSelectedGame || !title) {
            return undefined;
        }

        const controller = new AbortController();
        axios.get(`${API_URL}/search`, {
            params: { title },
            signal: controller.signal,
        }).then((response) => {
            const exactMatch = response.data.find(
                (result) => result.title.toLowerCase() === title.toLowerCase()
            );
            setLoadedGame({
                title,
                game: exactMatch ?? null,
                error: exactMatch ? '' : 'Game not found.',
            });
        }).catch((requestError) => {
            if (!axios.isCancel(requestError)) {
                console.error(requestError);
                setLoadedGame({
                    title,
                    game: null,
                    error: 'Could not load this game. Please try again.',
                });
            }
        });

        return () => controller.abort();
    }, [title, hasSelectedGame]);

    const game = hasSelectedGame
        ? selectedGame
        : loadedGame.title === title
            ? loadedGame.game
            : null;
    const error = !title
        ? 'Choose a game from search to see its details.'
        : loadedGame.title === title
            ? loadedGame.error
            : '';
    const loading = Boolean(title) && !hasSelectedGame && loadedGame.title !== title;

    if (loading) {
        return <main className="games-page"><p role="status">Loading game...</p></main>;
    }

    if (error || !game) {
        return <main className="games-page"><p role="status">{error || 'Game not found.'}</p></main>;
    }

    return (
        <main className="games-page game-details">
            {game.imagePath && <img src={game.imagePath} alt={game.title} />}
            <section>
                <h1>{game.title}</h1>
                {game.price != null && <p className="game-price">{game.price}</p>}
                {game.description && <p>{game.description}</p>}
                <button
                    className="add-to-cart"
                    type="button"
                    onClick={() => addItem(game)}
                >
                    Add to cart
                </button>
            </section>
        </main>
    );
}