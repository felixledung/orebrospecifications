document.addEventListener('DOMContentLoaded', function () {
    // Year in footer
    const yearSpan = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    // Variables for DOM elements
    let searchBtn = document.querySelector('.searchBtn');
    let closeBtn = document.querySelector('.closeBtn');
    let searchBox = document.querySelector('.searchBox');
    let navigation = document.querySelector('.navigation');
    let menuToggle = document.querySelector('.menuToggle');
    let header = document.querySelector('header');

    // Search box toggle
    searchBtn.onclick = function () {
        searchBox.classList.add('active');
        closeBtn.classList.add('active');
        searchBtn.classList.add('active');
        menuToggle.classList.add('hide');
        searchInput.focus(); // Focus on the search input when the search box is activated
    };

    closeBtn.onclick = function () {
        searchBox.classList.remove('active');
        closeBtn.classList.remove('active');
        searchBtn.classList.remove('active');
        menuToggle.classList.remove('hide');
        autocompleteList.innerHTML = ''; // Clear the autocomplete list when closing
    };

    // Menu toggle
    menuToggle.onclick = function () {
        header.classList.toggle('open');
        searchBox.classList.remove('active');
        closeBtn.classList.remove('active');
        searchBtn.classList.remove('active');
    };

    // Image slider
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slides .slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        const slidesContainer = document.querySelector('.slides');
        if (index >= totalSlides) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = totalSlides - 1;
        } else {
            currentSlide = index;
        }
        const offset = -currentSlide * 100;
        slidesContainer.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    setInterval(nextSlide, 3000); // Change slide every 3 seconds

    // Search system
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocompleteList');

    const suggestions = [
        { name: "Home", link: "index.html" },
        { name: "About", link: "about.html" },
        { name: "Services", link: "services.html" },
        { name: "Blog", link: "blog.html" },
        { name: "Contact", link: "contact.html" },
        { name: "Service 1", link: "service1.html" },
        { name: "Service 2", link: "service2.html" },
        { name: "Service 3", link: "service3.html" },
        { name: "Contact Us", link: "contact-us.html" },
        { name: "About Us", link: "about-us.html" }
    ];

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        autocompleteList.innerHTML = '';
        currentIndex = -1; // Reset current index on new input

        if (query) {
            const filteredSuggestions = suggestions.filter(item => item.name.toLowerCase().includes(query));

            filteredSuggestions.forEach((suggestion, index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-items');
                listItem.tabIndex = 0;

                // Highlight matching part
                const nameLowerCase = suggestion.name.toLowerCase();
                const startIndex = nameLowerCase.indexOf(query);
                const beforeMatch = suggestion.name.slice(0, startIndex);
                const match = suggestion.name.slice(startIndex, startIndex + query.length);
                const afterMatch = suggestion.name.slice(startIndex + query.length);

                listItem.innerHTML = `${beforeMatch}<strong>${match}</strong>${afterMatch}`;
                listItem.dataset.href = suggestion.link;

                listItem.addEventListener('click', function () {
                    window.location.href = suggestion.link;
                });

                autocompleteList.appendChild(listItem);
            });

            if (filteredSuggestions.length === 0) {
                autocompleteList.innerHTML = '<li class="list-items">No results could be found</li>';
            }
        }
    });

    document.addEventListener('click', function (e) {
        if (!autocompleteList.contains(e.target) && e.target !== searchInput) {
            autocompleteList.innerHTML = '';
        }
    });

    // Keyboard navigation for search results
    let currentIndex = -1;
    searchInput.addEventListener('keydown', function (e) {
        const listItems = document.querySelectorAll('.list-items');
        if (listItems.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                if (currentIndex < listItems.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSelectedItem(listItems);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = listItems.length - 1;
                }
                updateSelectedItem(listItems);
            } else if (e.key === "Enter" && currentIndex >= 0) {
                e.preventDefault();
                listItems[currentIndex].click();
            }
        }
    });

    function updateSelectedItem(listItems) {
        listItems.forEach((item, index) => {
            if (index === currentIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: "nearest" }); // Ensure selected item is in view
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // Toast notification
    const toast = document.getElementById('toast');
    const closeBtnToast = document.getElementById('toast-close');
    const progress = document.getElementById('toast-progress');
    const toastContent = toast.querySelector('.toast-content');
    const message = toastContent.querySelector('.message');

    // Function to fetch JSON data
    async function fetchToastData() {
        try {
            const response = await fetch('../json/toast.json'); // Replace with your JSON file path
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // Function to update toast content
    async function updateToast() {
        const data = await fetchToastData();

        if (data) {
            // Update toast content
            message.innerHTML = `
                <span class="text text-1">${data.title}</span>
                <span class="text text-2">${data.message}</span>
            `;

            // Show the toast notification with animation
            toast.classList.add('active');

            // Start progress animation
            progress.style.animation = 'none';
            progress.offsetHeight; /* Trigger reflow to restart animation */
            progress.style.animation = 'progress 5s linear forwards';

            // Hide the toast notification after a certain time
            setTimeout(() => {
                toast.classList.remove('active');
                progress.style.animation = ''; // Reset animation
            }, 5000); // Adjust this value as needed
        }
    }

    // Call the function to update toast on page load
    updateToast();

    // Hide the toast when close button is clicked
    closeBtnToast.addEventListener('click', () => {
        toast.classList.remove('active');
        progress.style.animation = ''; // Reset animation
    });
});

// Import Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Funktion för att uppdatera versionen
function uppdateraVersion(nyVersion) {
    // Hitta elementet med klassen 'version'
    var versionElement = document.querySelector('.version');

    // Uppdatera innehållet i elementet
    if (versionElement) {
        versionElement.textContent = `Version ${nyVersion}`;
    }
}

// Uppdatera versionen genom att anropa funktionen
uppdateraVersion('0.0.1');

// Integrerar ikoner i webbplatsen
function addIconLibrary(href) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
}

// Lägg till Font Awesome
addIconLibrary('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css');

// Lägg till Boxicons
addIconLibrary('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

// Lägg till Ionicons
addIconLibrary('https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js');