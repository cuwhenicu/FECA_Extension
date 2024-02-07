chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "highlightWords") {
    highlightWordsInPage(request.words);
  }
});

function highlightWordsInPage(words) {
  words.forEach((word) => {
    highlightWord(document.body, word);
  });
}

function highlightWord(node, word) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const regex = new RegExp("(" + word + ")", "gi");
      const matches = child.textContent.match(regex);
      if (matches) {
        const fragment = document.createDocumentFragment();
        let lastIdx = 0;
        child.textContent.replace(regex, (match, p1, offset) => {
          const before = child.textContent.slice(lastIdx, offset);
          lastIdx = offset + match.length;
          fragment.appendChild(document.createTextNode(before));

          const highlight = document.createElement("span");
          highlight.style.backgroundColor = "rgba(255, 238, 82, 0.25)";
          highlight.textContent = match;
          fragment.appendChild(highlight);
        });
        fragment.appendChild(
          document.createTextNode(child.textContent.slice(lastIdx))
        );
        node.replaceChild(fragment, child);
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      highlightWord(child, word);
    }
  });
}
