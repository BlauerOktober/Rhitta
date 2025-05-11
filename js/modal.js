// Show popup when page loads
  window.onload = function() {
    document.getElementById('modal').style.display = 'flex';
  };

  // Close the popup
  document.getElementById('close_modal').onclick = function() {
    document.getElementById('modal').style.display = 'none';
  };