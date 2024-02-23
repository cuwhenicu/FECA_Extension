chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "highlightWords") {
    let matchedWords = highlightWordsInPage(request.words);
    sendResponse({ words: matchedWords });
  }
});

function highlightWordsInPage(words) {
  let matchedWords = [];
  words.forEach((word) => {
    if (highlightWord(document.body, word)) {
      matchedWords.push(word);
    }
  });
  return matchedWords;
}

function highlightWord(node, word) {
  let matched = false;
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const regex = new RegExp("(" + word + ")", "gi");
      if (child.textContent.match(regex)) {
        matched = true; // 단어가 일치하면 matched를 true로 설정
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
      matched = highlightWord(child, word) || matched;
    }
  });
  return matched;
}
