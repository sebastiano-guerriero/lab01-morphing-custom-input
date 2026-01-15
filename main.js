import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

document.addEventListener("DOMContentLoaded", () => {
  const customButton = document.getElementById('custom-input-btn');
  const customInput = document.getElementById('input-custom-amount');
  const inputContainer = customInput.parentElement; // div with "absolute top-0 right-0"
  const amountContainer = inputContainer.parentElement; // div with "relative"
  
  if (!customButton || !customInput || !inputContainer || !amountContainer) return;
  
  customButton.addEventListener('click', () => {
    // Get the Custom button's position and size relative to the amount container
    const buttonRect = customButton.getBoundingClientRect();
    const containerRect = amountContainer.getBoundingClientRect();
    
    // Calculate position relative to the container
    const buttonLeft = buttonRect.left - containerRect.left;
    const buttonTop = buttonRect.top - containerRect.top;
    const buttonWidth = buttonRect.width;
    const finalWidth = containerRect.width;
    
    // Position input container at button's location with button's width
    inputContainer.style.left = `${buttonLeft}px`;
    inputContainer.style.top = `${buttonTop}px`;
    inputContainer.style.right = 'auto';
    customInput.style.width = `${buttonWidth}px`;
    
    // Add data-active attribute to change the style, enable pointer events, and make visible
    customInput.setAttribute('data-active', '');
    
    // Animate the input container left position and input width simultaneously
    // This makes it expand to the left
    animate(inputContainer, {
      left: [buttonLeft, 0]
    }, {
      type: "spring",
      duration: 0.4,
      bounce: 0
    });
    
    animate(customInput, {
      width: [buttonWidth, finalWidth]
    }, {
      type: "spring",
      duration: 0.4,
      bounce: 0
    });
  });
});

