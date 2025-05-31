// Optimized responsive touch handler for loading screen bee
export const handleBeeInteraction = (e) => {
    // Touch events for mobile devices
    const beeElement = e.currentTarget;

    // Add active class for touch devices
    beeElement.classList.add('active');

    // Remove active class after animation completes
    setTimeout(() => {
        beeElement.classList.remove('active');
    }, 3000);
};

export default handleBeeInteraction;
