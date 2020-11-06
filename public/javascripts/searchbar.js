

document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.querySelector('#searchBar')
  const searchLabel = document.querySelector('.navbar__search-label')
  const searchResultsContainer = document.querySelector('.search-results-container')
  const searchResultsList = document.querySelector('.search-results')

  searchInput.addEventListener('focusin', (e) => {
    searchLabel.style.backgroundColor = "rgba(255,255,255,1)"
  })

  searchInput.addEventListener('focusout', (e) => {
    searchLabel.style.backgroundColor = "rgba(255,255,255,.2)"
    searchInput.value = ''
  })

  searchInput.addEventListener('keyup', async (e) => {
    if (e.key === 'Escape') {
      e.target.value = ''
      e.target.blur()
      return
    }

    if (e.key === 'Enter') {
      let searchInput = e.target.value
      let tasks = await findTasksWithSearch(searchInput)


      if (tasks.length === 0) {
        alert('No tasks were found with these parameters!')
        return
      }

      searchResultsList.addEventListener('click', (e)=>e.stopPropagation())

      searchResultsContainer.addEventListener('click', (e) => {
        searchResultsContainer.classList.remove('search-results-container--shown')
      }, false)

      searchResultsList.innerHTML = '<h1>Search Results:</h1>'

      tasks.forEach( task => {
        searchResultsList.appendChild(createSearchTaskItem(task))
      })

      searchResultsContainer.classList.add('search-results-container--shown')
    }

  })

  const clearSearchInput = (e) => {
    e.target.value = ''
    e.target.blur()
  }

})

const findTasksWithSearch = async (include = '', exclude = '') => {

  let res = await fetch(`/tasks/search?includes=${encodeURI(include)}&excludes=${decodeURI(exclude)}`)
  let tasks = await res.json();
  return tasks
}

const createSearchTaskItem = (task) => {
  let taskItem = document.createElement('div')
  taskItem.classList.add('task-list__task-item')
  taskItem.id = `Task-${task.id}`
  taskItem.innerHTML = `
  <div class="task-list__task-bar"></div>
  <div class="task-list__task-select"></div>
  <span class="task-list__task-title">${task.title}</span>`

  taskItem.addEventListener('click', (e) => {

    //TODO: Create a way to display this tasks' details on our page for editing
    console.log(`hey we want details for task with id of ${task.id}`)
  })

  return taskItem
}
