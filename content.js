function highlightSelection() {
  document.addEventListener('mouseup', function () {
    let selectedText = window.getSelection().toString();
    if (selectedText.length > 0) {
      let span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.className = 'highlighted';
      let range = window.getSelection().getRangeAt(0);
      range.surroundContents(span);
      window.getSelection().removeAllRanges();

      // Salvar o highlight no storage
      saveHighlight(selectedText);
    }
  });
}

highlightSelection();

function saveHighlight(text) {
  const url = window.location.href;
  chrome.storage.local.get({ highlights: [] }, function (result) {
    let highlights = result.highlights;
    highlights.push({ text: text, url: url });
    chrome.storage.local.set({ highlights: highlights });
  });
}
