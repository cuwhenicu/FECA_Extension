// const getWordListFromAPI = async () => {
//   fetch(
//     'https://femiwiki.com/api.php?action=query&format=json&prop=links&titles=%ED%8B%80%3A%EC%A0%A0%EB%8D%94%ED%8F%AD%EB%A0%A5%20%EC%82%AC%EC%9D%B4%EB%93%9C%EB%B0%94&formatversion=2'
//   )
//     .then((response) => response.json())
//     .catch((error) => {
//       console.error('API 호출 중 오류 발생:', error)
//     })
//   const wordList = await new Promise((resolve, reject) =>
//     resolve(['데이트 폭력', '페미니즘', '가정폭력'])
//   )
//   const searchResults = document.querySelectorAll('span > em')
//   wordList.forEach((word) => {
//     searchResults.forEach((result) => {
//       if (result.innerText.includes(word)) {
//         result.style.backgroundColor = 'rgba(255,238,82,0.25)'
//       }
//     })
//   })
// }

// // 메시지 수신
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === 'showWordList') {
//     getWordListFromAPI()
//     sendResponse(request.wordList.join(', '))
//   }
// })


// content.js


// 이벤트 핸들러를 패시브로 설정
window.addEventListener('touchstart', handleTouchStart, { passive: true });

function handleTouchStart(event) {
  // 이벤트 처리 로직
}


// 메시지를 백그라운드 스크립트에 보내서 데이터를 가져옴
chrome.runtime.sendMessage({ action: 'showWordList' }, (response) => {
  // 응답 데이터를 처리
  const wordList = response.split(', ');
  const searchResults = document.querySelectorAll('span > em');
  
  wordList.forEach((word) => {
    searchResults.forEach((result) => {
      if (result.innerText.includes(word)) {
        result.style.backgroundColor = 'rgba(255, 238, 82, 0.25)';
      }
    });
  });
});
