

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.querySelector('#searchBar')
  const searchLabel = document.querySelector('.navbar__search-label')

  searchInput.addEventListener('focusin', (e) => {
    searchLabel.style.backgroundColor = "rgba(255,255,255,1)"
  })

  searchInput.addEventListener('focusout', (e) => {
    searchLabel.style.backgroundColor = "rgba(255,255,255,.2)"
    searchInput.value = ''
  })

  searchInput.addEventListener('keyup', async (e) => {
    console.log('key:', e.key)
    if (e.key === 'Escape') {
      clearSearchInput(e);
      return
    }

    if (e.key === 'Return') {
      let searchInput = e.target.value
      let tasks = await findTasksWithSearch(searchInput)
      console.log(tasks)
    }

  })

  const clearSearchInput = (e) => {
    e.target.value = ''
    e.target.blur()
  }

})

const findTasksWithSearch = async (include = '', exclude = '') => {



}
