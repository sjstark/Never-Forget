const searchInput = document.querySelector('#searchBar')
const searchLabel = document.querySelector('.navbar__search-label')

searchInput.addEventListener('focusin', (e) => {
  searchLabel.style.backgroundColor = "rgba(255,255,255,1)"
})

searchInput.addEventListener('focusout', (e) => {
  searchLabel.style.backgroundColor = "rgba(255,255,255,.2)"
})
