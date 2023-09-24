
// 메시지 수신
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'highlight') {
      const data = request.data;
      console.log('API 데이터를 받았습니다:', data);
    }
  });
  