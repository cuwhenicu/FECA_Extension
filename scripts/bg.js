
// API 호출 함수
function callApi() {
    fetch('https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%3A%EC%A0%A0%EB%8D%94%ED%8F%AD%EB%A0%A5%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94&formatversion=2')
      .then(response => response.json())
      .then(data => {
        // API 응답을 Content Script로 메시지로 전달
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, { action: 'highlight', data: data });
        });
      })
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
      });
  }
  
  // 백그라운드 스크립트 시작 시 API 호출
  callApi();
  