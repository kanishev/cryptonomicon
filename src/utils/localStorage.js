const PAGECOUNT_KEY = "pageCount";

export function setLocalStorageData(keyName, count) {
  localStorage.setItem(keyName, JSON.stringify(count));
}

export function getLocalStoragedData(keyName) {
  return JSON.parse(localStorage.getItem(keyName));
}

export function setLSPageData() {
  let pageData = getLocalStoragedData(PAGECOUNT_KEY);

  if (!pageData) {
    setLocalStorageData(PAGECOUNT_KEY, 1);
  } else {
    pageData++;
    setLocalStorageData(PAGECOUNT_KEY, pageData);
  }
}

export function updateLSPageData() {
  let pageData = getLocalStoragedData(PAGECOUNT_KEY);

  if (!pageData) {
    return;
  }

  if (pageData === 1) {
    setLocalStorageData(PAGECOUNT_KEY, null);
  } else {
    pageData--;
    setLocalStorageData(PAGECOUNT_KEY, pageData);
  }
}
