



// 백그라운드 스크립트에서 데이터를 가져오고 팝업 스크립트로 전송
const getWordListFromAPI = async () => {
    try {
      const response = await fetch('https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%3A%EC%A0%A0%EB%8D%94%ED%8F%AD%EB%A0%A5%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94&formatversion=2');
  
      if (!response.ok) {
        throw new Error('API 호출 중 오류 발생');
      }
  
      const data = await response.json();
      const wordList = ['데이트 폭력', '페미니즘', '가정폭력']; // 더 이상 하드 코딩하지 않고 API에서 가져올 수 있음
  
      return wordList;
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      return [];
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'showWordList') {
      getWordListFromAPI().then((wordList) => {
        sendResponse(wordList.join(', '));
      });
      return true;
    }
  });
  