const FEMI_WIKI_URL = "https://femiwiki.com/w";
let globalWords = [];
let matchedWords = [];
let currentPage = 1;
let visibleStart = 1;
let visibleEnd = 3;
const itemsPerPage = 15;

document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("showWordList");

  const firstPage = document.getElementById("firstPage");
  const secondPage = document.getElementById("secondPage");

  const closeButton = document.getElementById("closeButton");
  closeButton.addEventListener("click", () => {
    window.close();
  });

  button.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.runtime.sendMessage({ action: "fetchWords" }, function (response) {
        if (response) {
          // 1. 페미위키로부터 받아온 젠더폭력 단어 배열
          globalWords = response.words;

          // 2. 젠더폭력 단어 배열로 현재 문서에서 매치가 된 단어를 추리기
          chrome.tabs.sendMessage(
            tabs[0].id,
            {
              action: "highlightWords",
              words: globalWords,
            },
            function (res) {
              console.log(res);
              matchedWords = res.words;

              // 3. 추린 단어를 팝업에 목록으로 보여주기
              showPage(currentPage);

              // 새로운 페이지네이션 컨테이너 생성
              const paginationContainer = document.createElement("div");
              paginationContainer.id = "paginationContainer";

              // 페이지네이션 생성
              const pagination = createPagination(
                matchedWords.length,
                itemsPerPage
              );
              paginationContainer.appendChild(pagination);

              // 'footer' 클래스를 가진 요소 찾기
              const footer = document.querySelector(".footer");
              footer.appendChild(paginationContainer);

              updatePaginationButtons();

              // 페이지 전환 로직
              firstPage.classList.add("hide");
              secondPage.classList.remove("hide");
            }
          );
        }
      });
    });
  });
});

function setWordList(words) {
  const resultElement = document.getElementById("result");
  resultElement.innerHTML = ""; // 기존 내용 지우기

  if (words.length > 0) {
    // 새로운 컨테이너 요소 생성
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");

    const textWrapper = document.createElement("div");
    textWrapper.classList.add("text-wrapper");

    // 이미지 요소 생성
    const imageElement = document.createElement("img");
    imageElement.src = "images/content-image.png";
    imageElement.classList.add("content-image");

    const titleText = document.createElement("div");
    titleText.classList.add("title");
    titleText.textContent = `총 ${matchedWords.length}개의 단어를 페미니즘의 시선으로 읽을 수 있어요.`;

    const descText = document.createElement("div");
    descText.classList.add("desc");
    descText.textContent =
      "각 단어를 누르면 페미위키의 해당 항목으로 이동합니다.";

    const listElement = document.createElement("div");
    listElement.classList.add("list");

    textWrapper.appendChild(titleText);
    textWrapper.appendChild(descText);
    contentContainer.appendChild(imageElement);
    contentContainer.appendChild(textWrapper);

    resultElement.appendChild(contentContainer);
    resultElement.appendChild(listElement);

    words.forEach((item) => {
      const chipElement = document.createElement("a");
      chipElement.classList.add("chip");
      chipElement.textContent = item;
      chipElement.href = `${FEMI_WIKI_URL}/${encodeURI(item)}`;
      chipElement.target = "_blank";
      listElement.appendChild(chipElement);
    });
  } else {
    const contentContainer = document.createElement("div");
    contentContainer.classList.add("content-container");

    const textWrapper = document.createElement("div");
    textWrapper.classList.add("text-wrapper");

    // 이미지 요소 생성
    const imageElement = document.createElement("img");
    imageElement.src = "images/content-image.png";
    imageElement.classList.add("content-image");

    const titleText = document.createElement("div");
    titleText.classList.add("title");
    titleText.textContent = "입력하신 단어는 미등록된 단어입니다.";

    const descText = document.createElement("div");
    descText.classList.add("desc");
    descText.textContent = "추가 요청하시겠습니까?";

    textWrapper.appendChild(titleText);
    textWrapper.appendChild(descText);
    contentContainer.appendChild(imageElement);
    contentContainer.appendChild(textWrapper);

    resultElement.appendChild(contentContainer);
  }
}

let currentPageOffset = 0;

// 페이지네이션 생성 함수
function createPagination(totalItems, itemsPerPage) {
  const paginationContainer = document.createElement("div");
  paginationContainer.classList.add("pagination");

  if (totalItems <= itemsPerPage) {
    paginationContainer.style.display = "none";
    return paginationContainer;
  }

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const leftArrow = createArrow("left");
  paginationContainer.appendChild(leftArrow);

  const pageControl = document.createElement("div");
  pageControl.classList.add("page-control");

  // 페이지 버튼 추가
  for (let i = 1; i <= pageCount; i++) {
    const pageButton = document.createElement("button");
    pageButton.className = "page-button";
    pageButton.textContent = i;
    pageButton.addEventListener("click", () => {
      showPage(i);
    });
    pageControl.appendChild(pageButton);
  }

  paginationContainer.appendChild(pageControl);

  const rightArrow = createArrow("right");
  paginationContainer.appendChild(rightArrow);
  rightArrow.style.display =
    pageCount > 3 && currentPage < pageCount ? "block" : "none";

  return paginationContainer;
}

// 화살표 생성 함수
function createArrow(direction) {
  const arrow = document.createElement("img");
  arrow.src =
    direction === "left" ? "images/left-arrow.png" : "images/right-arrow.png";
  arrow.className = `page-arrows ${direction}-arrow`;
  arrow.addEventListener("click", () =>
    movePagination(direction === "left" ? -1 : 1)
  );
  return arrow;
}

function movePagination(direction) {
  // 실제 페이지 이동 로직
  const newPageNumber = currentPage + direction;
  if (
    newPageNumber >= 1 &&
    newPageNumber <= Math.ceil(globalWords.length / itemsPerPage)
  ) {
    currentPage = newPageNumber;
    showPage(newPageNumber);
    moveVisibleRange(direction); // 현재 보이는 페이지 범위 업데이트
    updatePaginationButtons();
  }
}

function updatePaginationButtons() {
  // 화살표 가시성 업데이트
  updateArrowVisibility();

  // 페이지 버튼 가시성 업데이트
  const buttons = document.querySelectorAll(".page-button");
  buttons.forEach((button, index) => {
    button.classList.remove("active");

    if (index + 1 === currentPage) {
      button.classList.add("active");
    }

    button.style.display =
      index + 1 >= visibleStart && index + 1 <= visibleEnd ? "block" : "none";
  });
}
function updateArrowVisibility() {
  const pageCount = Math.ceil(globalWords.length / itemsPerPage);
  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");

  if (leftArrow && rightArrow) {
    leftArrow.classList.toggle("visible", currentPage > 1);
    rightArrow.classList.toggle("visible", currentPage < pageCount);
  }
}
// 화살표 클릭에 따른 페이지 범위 이동
function moveVisibleRange(direction) {
  const pageCount = Math.ceil(globalWords.length / itemsPerPage);
  if (direction === 1 && visibleEnd < pageCount) {
    visibleStart += 1;
    visibleEnd += 1;
  } else if (direction === -1 && visibleStart > 1) {
    visibleStart -= 1;
    visibleEnd -= 1;
  }
  updatePaginationButtons();
}

// 페이지 보여주기 함수
function showPage(pageNumber) {
  currentPage = pageNumber;
  const paginatedWords = paginateArray(matchedWords, itemsPerPage, pageNumber);
  setWordList(paginatedWords);
  updatePaginationButtons();
}

function paginateArray(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}
