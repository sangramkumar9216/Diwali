// Wait for the webpage to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    // 1. Get the URL's query string (everything after the "?")
    const queryString = window.location.search;
    
    // 2. Create an object to easily parse the query string
    const urlParams = new URLSearchParams(queryString);
    
    // 3. Get the value of the 'name' parameter
    const name = urlParams.get('name');
    
    // 4. Find the HTML element with the ID 'name-display'
    const nameElement = document.getElementById('name-display');
    
    // 5. Check if a name was provided in the URL
    if (name) {
        // If yes, update the h2 tag's text
        nameElement.textContent = `${name}!`;
    }
    // If no name is in the URL, it will show the default "My Friend!"
});