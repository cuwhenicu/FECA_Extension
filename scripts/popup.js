// 이벤트 핸들러를 패시브로 설정
window.addEventListener('touchstart', handleTouchStart, { passive: true })

function handleTouchStart(event) {
  // 이벤트 처리 로직
}

const FEMI_WIKI_URL = 'https://femiwiki.com/w'

const setWordList = (data) => {
  const resultElement = document.getElementById('result')

  const titleText = document.createElement('div')
  titleText.classList.add('title')
  titleText.textContent = `총 ${data.length}개의 단어를 페미니즘의 시선으로 읽을 수 있어요.`

  const descText = document.createElement('div')
  descText.classList.add('desc')
  descText.textContent = '각 단어를 누르면 페미위키의 해당 항목으로 이동합니다.'

  const listElement = document.createElement('div')
  listElement.classList.add('list')

  resultElement
    .appendChild(titleText)
    .appendChild(descText)
    .appendChild(listElement)

  data.forEach((item) => {
    const chipElement = document.createElement('a')

    chipElement.classList.add('chip')
    chipElement.textContent = item
    chipElement.setAttribute('href', `${FEMI_WIKI_URL}/${encodeURI(item)}`)
    chipElement.setAttribute('target', `_blank`)

    listElement.appendChild(chipElement)
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('showWordList')

  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'showWordList' }, (response) => {
      setWordList(response)
    })
  })
})
