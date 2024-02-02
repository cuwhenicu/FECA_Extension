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

// function highlightWords(wordList) {
//   function walkTheNode(node) {
//     if (node.nodeType === 3) {
//       const modifiedNode = document.createDocumentFragment();
//       let lastIndex = 0;
//       wordList.forEach((word) => {
//         const regex = new RegExp(word, "gi");
//         let match;
//         while ((match = regex.exec(node.textContent)) !== null) {
//           modifiedNode.appendChild(
//             document.createTextNode(
//               node.textContent.substring(lastIndex, match.index)
//             )
//           );
//           const highlightSpan = document.createElement("span");
//           highlightSpan.style.backgroundColor = "rgba(255, 238, 82, 0.25)";
//           highlightSpan.textContent = match[0];
//           modifiedNode.appendChild(highlightSpan);
//           lastIndex = regex.lastIndex;
//         }
//       });
//       modifiedNode.appendChild(
//         document.createTextNode(node.textContent.substring(lastIndex))
//       );
//       node.parentNode.replaceChild(modifiedNode, node);
//     } else if (
//       node.nodeType === 1 &&
//       node.nodeName !== "SCRIPT" &&
//       node.nodeName !== "STYLE"
//     ) {
//       Array.from(node.childNodes).forEach(walkTheNode);
//     }
//   }
//   walkTheNode(document.body);
// }

// function collectWordsFromPage() {
//   let words = new Set();
//   function walkTheNode(node) {
//     if (node.nodeType === 3) {
//       let textWords = node.textContent.match(/\b\w+\b/g);
//       if (textWords) {
//         textWords.forEach((word) => words.add(word.toLowerCase()));
//       }
//     } else if (
//       node.nodeType === 1 &&
//       node.nodeName !== "SCRIPT" &&
//       node.nodeName !== "STYLE"
//     ) {
//       Array.from(node.childNodes).forEach(walkTheNode);
//     }
//   }
//   walkTheNode(document.body);
//   return Array.from(words);
// }

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "highlightWords") {
//     highlightWords(request.wordList);
//   } else if (request.action === "collectWordsFromPage") {
//     sendResponse(collectWordsFromPage());
//   }
// });
