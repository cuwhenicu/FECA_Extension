chrome.runtime.sendMessage({ action: "showWordList" }, (response) => {
  const wordList = response.split(", ").map((word) => word.trim());
  function walkTheNode(node) {
    if (node.nodeType === 3) {
      // 텍스트 노드인 경우
      const modifiedNode = document.createDocumentFragment();
      let lastIndex = 0;
      wordList.forEach((word) => {
        const regex = new RegExp(word, "gi");
        let match;
        while ((match = regex.exec(node.textContent)) !== null) {
          modifiedNode.appendChild(
            document.createTextNode(
              node.textContent.substring(lastIndex, match.index)
            )
          );
          const highlightSpan = document.createElement("span");
          highlightSpan.style.backgroundColor = "rgba(255, 238, 82, 0.25)";
          highlightSpan.textContent = match[0];
          modifiedNode.appendChild(highlightSpan);
          lastIndex = regex.lastIndex;
        }
      });
      modifiedNode.appendChild(
        document.createTextNode(node.textContent.substring(lastIndex))
      );
      node.parentNode.replaceChild(modifiedNode, node);
    } else if (
      node.nodeType === 1 &&
      node.nodeName !== "SCRIPT" &&
      node.nodeName !== "STYLE"
    ) {
      Array.from(node.childNodes).forEach(walkTheNode);
    }
  }
  walkTheNode(document.body);
});
