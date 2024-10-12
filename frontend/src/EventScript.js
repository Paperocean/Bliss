const eventItems = document.querySelectorAll('.event-item');
const eventPreview = document.querySelector('.event-preview');

eventItems.forEach(item => {
    item.addEventListener('click', () => {
        // Reset active state for all items
        eventItems.forEach(i => i.classList.remove('active'));
        // Set the selected item as active
        item.classList.add('active');

        // Update event preview content based on the clicked item
        eventPreview.textContent = `Preview for ${item.textContent}`; // Change this as needed

        // Add animation class
        eventPreview.classList.add('animated-preview');

        // Show preview
        eventPreview.classList.add('active');
    });
});
