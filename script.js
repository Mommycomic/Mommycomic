// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Functionality ---
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navLinks = document.getElementById('navLinks');

    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- Comic Data (for Search and Filter) ---
    const comicGrid = document.getElementById('comicGrid');
    let comicsData = []; // Will store comic elements and their data

    if (comicGrid) {
        const comicCards = Array.from(comicGrid.getElementsByClassName('comic-card'));
        comicsData = comicCards.map(card => ({
            element: card,
            title: card.dataset.title ? card.dataset.title.toLowerCase() : '',
            tags: card.dataset.tags ? card.dataset.tags.split(',').map(tag => tag.trim().toLowerCase()) : []
        }));
    }

    // --- Search and Filter Functionality ---
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResultsDropdown = document.getElementById('searchResultsDropdown');
    const tagFilterContainer = document.getElementById('tagFilterContainer');

    const filterComics = () => {
        if (!comicGrid) return; // Exit if no comic grid

        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeTagButtons = tagFilterContainer ? tagFilterContainer.querySelectorAll('.tag-button.active') : [];
        const activeTags = Array.from(activeTagButtons).map(button => button.dataset.tag);

        comicsData.forEach(comic => {
            const cardTitle = comic.title;
            const cardTags = comic.tags;

            const matchesSearch = searchTerm === '' || cardTitle.includes(searchTerm);
            const matchesTags = activeTags.includes('all') || activeTags.some(tag => cardTags.includes(tag));

            if (matchesSearch && matchesTags) {
                comic.element.style.display = 'flex';
            } else {
                comic.element.style.display = 'none';
            }
        });
    };

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchResultsDropdown) {
                searchResultsDropdown.innerHTML = ''; // Clear previous results

                if (searchTerm.length > 0) {
                    const filteredSuggestions = comicsData.filter(comic =>
                        comic.title.includes(searchTerm)
                    ).slice(0, 5); // Limit suggestions to 5

                    if (filteredSuggestions.length > 0) {
                        filteredSuggestions.forEach(comic => {
                            const div = document.createElement('div');
                            div.textContent = comic.element.dataset.title;
                            div.addEventListener('click', () => {
                                searchInput.value = comic.element.dataset.title;
                                searchResultsDropdown.classList.remove('active');
                                filterComics(); // Filter when a suggestion is clicked
                            });
                            searchResultsDropdown.appendChild(div);
                        });
                        searchResultsDropdown.classList.add('active');
                    } else {
                        searchResultsDropdown.classList.remove('active');
                    }
                } else {
                    searchResultsDropdown.classList.remove('active');
                    filterComics(); // Filter when search input is cleared
                }
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (searchInput && searchResultsDropdown && !searchInput.contains(event.target) && !searchResultsDropdown.contains(event.target)) {
                searchResultsDropdown.classList.remove('active');
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', filterComics);
    }

    if (tagFilterContainer) {
        tagFilterContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('tag-button')) {
                const clickedTag = event.target.dataset.tag;

                // Deactivate all tags first, then activate the clicked one
                tagFilterContainer.querySelectorAll('.tag-button').forEach(button => {
                    button.classList.remove('active');
                });
                event.target.classList.add('active');

                filterComics();
            }
        });
    }

    // Initial filter on page load for the main menu page
    if (comicGrid) {
        filterComics();
    }


    // --- Service Worker Registration (for PWA) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js') // sw.js will be created next
                .then(registration => {
                    console.log('Service Worker registered:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        });
    }
});