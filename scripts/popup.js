const FEMI_WIKI_URL = "https://femiwiki.com/w";

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("showWordList");

  button.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "showWordList" }, (response) => {
      const wordArray = response.split(", "); // 문자열을 배열로 변환
      setWordList(wordArray);
    });
  });
});

const setWordList = (data) => {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = ""; // 기존 내용을 지웁니다.

  const titleText = document.createElement("div");
  titleText.classList.add("title");
  titleText.textContent = `총 ${data.length}개의 단어를 페미니즘의 시선으로 읽을 수 있어요.`;

  const descText = document.createElement("div");
  descText.classList.add("desc");
  descText.textContent =
    "각 단어를 누르면 페미위키의 해당 항목으로 이동합니다.";

  const listElement = document.createElement("div");
  listElement.classList.add("list");

  // 노드를 순차적으로 추가합니다.
  resultElement.appendChild(titleText);
  resultElement.appendChild(descText);
  resultElement.appendChild(listElement);

  data.forEach((item) => {
    const chipElement = document.createElement("a");
    chipElement.classList.add("chip");
    chipElement.textContent = item;
    chipElement.href = `${FEMI_WIKI_URL}/${encodeURI(item)}`;
    chipElement.target = "_blank";
    listElement.appendChild(chipElement);
  });
};
