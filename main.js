import { animate } from 'https://cdn.jsdelivr.net/npm/motion@latest/+esm';

document.addEventListener("DOMContentLoaded", () => {
  const customButton = document.getElementById('custom-input-btn');
  const customInput = document.getElementById('input-custom-amount');
  const inputContainer = customInput.parentElement;
  const amountContainer = inputContainer.parentElement;
  const btnsLarge = document.getElementById('btns-large');
  const btnsSmall = document.getElementById('btns-small');
  const sendButton = document.getElementById('send-button');
  
  if (!customButton || !customInput || !inputContainer || !amountContainer || !btnsLarge || !btnsSmall || !sendButton) return;
  
  // Get all label elements from btns-large (excluding custom)
  const amountLabels = Array.from(btnsLarge.querySelectorAll('label')).filter(
    label => label !== customButton
  );
  
  // Get all buttons from btns-small
  const smallButtons = Array.from(btnsSmall.querySelectorAll('button'));
  
  // Get js-amount element
  const jsAmount = document.querySelector('.js-amount');
  
  // Function to update js-amount display
  function updateAmountDisplay(value) {
    if (jsAmount) {
      const numValue = parseFloat(value) || 0;
      jsAmount.textContent = `$${numValue.toFixed(2)}`;
    }
  }
  
  // Add event listeners to all radio buttons (initial state)
  const allRadioInputs = btnsLarge.querySelectorAll('input[type="radio"]');
  allRadioInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked && e.target.value !== 'custom') {
        updateAmountDisplay(e.target.value);
      }
    });
  });
  
  // Add input event listener to custom input
  customInput.addEventListener('input', (e) => {
    const value = e.target.value;
    updateAmountDisplay(value);
  });
  
  // Initially position buttons absolutely on top of their corresponding labels
  amountLabels.forEach((label, index) => {
    if (index >= smallButtons.length) return;
    
    const smallBtn = smallButtons[index];
    const labelRect = label.getBoundingClientRect();
    const containerRect = amountContainer.getBoundingClientRect();
    
    // Position button on top of label
    const labelLeft = labelRect.left - containerRect.left;
    const labelTop = labelRect.top - containerRect.top;
    const labelWidth = labelRect.width;
    const labelHeight = labelRect.height;
    
    // Set button to absolute positioning, matching label's position and size
    // Don't set fontSize - let CSS handle it via data-minimize
    smallBtn.style.position = 'absolute';
    smallBtn.style.left = `${labelLeft}px`;
    smallBtn.style.top = `${labelTop}px`;
    smallBtn.style.width = `${labelWidth}px`;
    smallBtn.style.height = `${labelHeight}px`;
    smallBtn.style.opacity = '0';
  });
  
  customButton.addEventListener('click', () => {
    const containerRect = amountContainer.getBoundingClientRect();
    
    // Get button position and size before hiding it
    const buttonRect = customButton.getBoundingClientRect();
    const buttonLeft = buttonRect.left - containerRect.left;
    const buttonTop = buttonRect.top - containerRect.top;
    const buttonWidth = buttonRect.width;
    const finalWidth = containerRect.width;
    
    // Hide custom button instantly (no transition)
    customButton.style.opacity = '0';
    customButton.style.pointerEvents = 'none';
    
    // Position input at button's location and make it visible instantly
    inputContainer.style.left = `${buttonLeft}px`;
    inputContainer.style.top = `${buttonTop}px`;
    inputContainer.style.right = 'auto';
    customInput.style.width = `${buttonWidth}px`;
    customInput.style.opacity = '1'; // Show instantly
    
    // Reset input value and set placeholder
    customInput.value = '';
    customInput.placeholder = '0.00';
    
    // Reset js-amount to $0.00
    updateAmountDisplay('0.00');
    
    customInput.setAttribute('data-active', '');
    
    // Now animate the position and width
    animate(inputContainer, {
      left: [buttonLeft, 0]
    }, {
      type: "spring",
      duration: 0.3,
      bounce: 0
    });
    
    animate(customInput, {
      width: [buttonWidth, finalWidth]
    }, {
      type: "spring",
      duration: 0.3,
      bounce: 0
    }).finished.then(() => {
      // Focus the input after animation completes
      customInput.focus();
    });
    
    // Hide original labels immediately when buttons become visible
    amountLabels.forEach(label => {
      label.style.opacity = '0';
      label.style.pointerEvents = 'none';
    });
    
    // Add data-minimize to all buttons
    smallButtons.forEach(btn => {
      btn.setAttribute('data-minimize', '');
    });
    
    // Force reflow to get final dimensions with data-minimize applied
    void btnsSmall.offsetWidth;
    
    // Calculate final widths for all buttons first
    const finalWidths = smallButtons.map(btn => {
      // Create a temporary element to measure text width with text-xs
      const tempSpan = document.createElement('span');
      tempSpan.style.position = 'absolute';
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.fontSize = '0.75rem'; // text-xs
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.textContent = btn.textContent.trim();
      document.body.appendChild(tempSpan);
      const textWidth = tempSpan.getBoundingClientRect().width;
      document.body.removeChild(tempSpan);
      return textWidth + 12; // 6px padding on each side
    });
    
    // Calculate final left positions with 6px gap
    let currentLeft = 0;
    const finalLefts = finalWidths.map(width => {
      const left = currentLeft;
      currentLeft += width + 6; // button width + 6px gap
      return left;
    });
    
    // Add data-active to btns-small container to enable pointer events
    btnsSmall.setAttribute('data-active', '');
    
    // Add click handlers to buttons to update input value
    smallButtons.forEach((btn, index) => {
      // Get the value from the corresponding label's radio input
      const correspondingLabel = amountLabels[index];
      if (correspondingLabel) {
        const radioInput = correspondingLabel.querySelector('input[type="radio"]');
        const value = radioInput ? radioInput.value : btn.textContent.trim();
        
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          customInput.value = value;
          updateAmountDisplay(value);
          customInput.focus();
        });
      }
    });
    
    // Animate buttons from label positions to final position (top: 52px)
    amountLabels.forEach((label, index) => {
      if (index >= smallButtons.length) return;
      
      const smallBtn = smallButtons[index];
      const labelRect = label.getBoundingClientRect();
      const labelLeft = labelRect.left - containerRect.left;
      const labelTop = labelRect.top - containerRect.top;
      const labelWidth = labelRect.width;
      const labelHeight = 40; // h-10 = 40px
      
      const finalBtnWidth = finalWidths[index];
      const finalBtnLeft = finalLefts[index];
      const finalBtnHeight = 18; // h-4.5 = 18px
      const finalTop = 52;
      
      // Make button visible
      smallBtn.style.opacity = '1';
      
      // Animate width, height, top, and left position
      animate(smallBtn, {
        left: [labelLeft, finalBtnLeft],
        top: [labelTop, finalTop],
        width: [labelWidth, finalBtnWidth],
        height: [labelHeight, finalBtnHeight]
      }, {
        type: "spring",
        duration: 0.3,
        bounce: 0
      });
    });
    
    // Add data-push to send button
    sendButton.setAttribute('data-push', '');
  });
});

