chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fetchWords") {
    fetch(
      "https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%3A%EC%A0%A0%EB%8D%94%ED%8F%AD%EB%A0%A5%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94&pllimit=69&formatversion=2"
    )
      .then((response) => response.json())
      .then((data) => {
        const words = data.query.pages[0].links.map((link) => link.title);
        sendResponse({ words: words });
      })
      .catch((error) => {
        console.error("Error fetching words:", error);
        sendResponse({ error: error.message });
      });
    return true; // 비동기 응답 처리를 위해 true를 반환
  }
});
