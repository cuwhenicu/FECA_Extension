// 메시지를 백그라운드 스크립트에 보내서 데이터를 가져옴
chrome.runtime.sendMessage({ action: "showWordList" }, (response) => {
  // 응답 데이터를 처리
  const wordList = response.split(", ").map((word) => word.replace(/\s/g, "")); // 단어에서 띄어쓰기 제거

  function walkTheNode(node) {
    if (node.nodeType === 3) {
      // 텍스트 노드인 경우
      const textContentWithoutSpaces = node.textContent.replace(/\s/g, ""); // 노드의 텍스트에서 띄어쓰기 제거
      wordList.forEach((word) => {
        if (textContentWithoutSpaces.includes(word)) {
          // 하이라이트 처리할 텍스트를 찾는 로직
          const regex = new RegExp(word, "gi");
          const highlightedText = node.textContent.replace(
            regex,
            (match) =>
              `<span style="background-color: rgba(255, 238, 82, 0.25);">${match}</span>`
          );
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = highlightedText;

          while (tempDiv.firstChild) {
            node.parentNode.insertBefore(tempDiv.firstChild, node);
          }
          node.parentNode.removeChild(node);
        }
      });
    } else if (
      node.nodeType === 1 &&
      node.nodeName !== "SCRIPT" &&
      node.nodeName !== "STYLE"
    ) {
      Array.from(node.childNodes).forEach((child) => walkTheNode(child));
    }
  }

  walkTheNode(document.body); // document.body에서 시작하여 모든 노드 순회
});
