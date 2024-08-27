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
      div.style.marginBottom = '10px';

      let urlDiv = document.createElement('div');
      urlDiv.textContent = `URL: ${highlight.url}`;
      urlDiv.style.fontSize = '10px';
      urlDiv.style.color = 'gray';
      div.appendChild(urlDiv);

      let textDiv = document.createElement('div');
      textDiv.textContent = highlight.text;
      div.appendChild(textDiv);

      let copyButton = document.createElement('button');
      copyButton.textContent = 'Copy to Clipboard';
      copyButton.style.marginTop = '5px';
      copyButton.addEventListener('click', function () {
        copyToClipboard(highlight.text);
      });
      div.appendChild(copyButton);

      highlightsList.appendChild(div);
    });
  });
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(function () {
    alert('Text copied to clipboard');
  }, function (err) {
    console.error('Failed to copy text: ', err);
  });
}
