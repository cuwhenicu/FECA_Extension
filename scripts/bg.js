chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "fetchWords") {
    // 첫 번째 API 호출
    const fetchWords = fetch(
      "https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%3A%EC%A0%A0%EB%8D%94%ED%8F%AD%EB%A0%A5%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94&pllimit=max&formatversion=2"
    )
      .then((response) => response.json())
      .then((data) => {
        const excludedPrefixes = ["틀:", "틀토론:"]; // 제외할 항목의 접두사
        return data.query.pages[0].links
          .map((link) => link.title)
          .filter(
            (title) =>
              !excludedPrefixes.some((prefix) => title.startsWith(prefix))
          ); // 제외할 접두사로 시작하지 않는 항목만 필터링
      });

    // 두 번째 API 호출 (새로운 기능으로 분류)
    const fetchPolitics = fetch(
      "https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%7C%EC%84%B1%EC%9D%B8%EC%A7%80%EA%B0%90%EC%88%98%EC%84%B1_%EB%82%99%EC%A0%9C_%EC%A0%95%EC%B9%98%EC%9D%B8&pllimit=max&formatversion=2"
    )
      .then((response) => response.json())
      .then((data) => {
        let allLinks = [];
        const pages = data.query.pages;
        const excludedPrefixes = ["틀:", "틀토론:"]; // 제외할 항목의 접두사

        pages.forEach((page) => {
          // 'missing' 속성이 없고, 'links' 배열이 존재하는 페이지만 처리
          if (!page.missing && Array.isArray(page.links)) {
            const titles = page.links.map((link) => link.title);
            allLinks = allLinks.concat(titles);
          }
        });

        // 중복을 제거하고, 제외할 접두사로 시작하지 않는 항목만 필터링
        return [...new Set(allLinks)].filter(
          (title) =>
            !excludedPrefixes.some((prefix) => title.startsWith(prefix))
        );
      });

    Promise.all([fetchWords, fetchPolitics])
      .then((results) => {
        const [words, politics] = results;
        // 여기에서 두 API 호출의 결과를 합쳐서 처리
        sendResponse({ words: words, politics: politics });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        sendResponse({ error: error.message });
      });
    return true; // 비동기 응답 처리를 위해 true를 반환합니다.
  }
});
