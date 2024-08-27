document.addEventListener('DOMContentLoaded', function () {
  loadHighlights();
  document.getElementById('clear').addEventListener('click', clearAllHighlights);
});

function clearAllHighlights() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: clearHighlights
    });
  });

  // Limpar também do storage
  chrome.storage.local.set({ highlights: [] }, function () {
    loadHighlights();
  });
}

function clearHighlights() {
  let highlights = document.querySelectorAll('.highlighted');
  highlights.forEach(function (highlight) {
    let parent = highlight.parentNode;
    while (highlight.firstChild) {
      parent.insertBefore(highlight.firstChild, highlight);
    }
    parent.removeChild(highlight);
  });
}

function loadHighlights() {
  chrome.storage.local.get({ highlights: [] }, function (result) {
    let highlightsList = document.getElementById('highlights-list');
    highlightsList.innerHTML = ''; // Limpar lista antes de adicionar
    result.highlights.forEach(function (highlight) {
      let div = document.createElement('div');
      div.textContent = highlight;
      highlightsList.appendChild(div);
    });
  });
}
