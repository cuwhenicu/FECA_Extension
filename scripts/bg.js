const getWordListFromAPI = async () => {
  try {
    const response = await fetch(
      "https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%3A%EC%A0%A0%EB%8D%94%ED%8F%AD%EB%A0%A5%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94&formatversion=2"
    );

    if (!response.ok) {
      throw new Error("API 호출 중 오류 발생");
    }

    const data = await response.json();
    const wordList = [];

    // 'pages' 배열에서 'links' 객체 추출 및 각 링크의 'title'을 'wordList'에 추가
    data.query.pages.forEach((page) => {
      if (page.links) {
        page.links.forEach((link) => {
          wordList.push(link.title);
        });
      }
    });

    return wordList;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    return [];
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showWordList") {
    getWordListFromAPI().then((wordList) => {
      sendResponse(wordList.join(", "));
    });
    return true;
  }
});
