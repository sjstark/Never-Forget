/******************************************************************************/
/***************************** LIST FUNCTIONS *********************************/
/******************************************************************************/

export const createNewList = async (title) => {
  // console.log('\n Attempting to create new list')
  let body = {
    title: title,
    _csrf: document.querySelector('#csrf').value
  }

  // console.log('list body:', body)

  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
  try {
    let res = await fetch('/lists', options)
    if (!res.ok) throw res
    // else console.log('success in posting?')
  } catch (err) {
    // console.log('hit error when creating list')
    console.error(err)
  }
}


export const getListId = async (listTitle) => {
  let lists = await getLists();

  for (let i = 0; i < lists.length; i++) {
    let list = lists[i];
    if (list.title === listTitle) {
      return list.id
    }
  }
}

export const getLists = async () => {
  let res = await fetch('/lists')
  let body = await res.json();
  let lists = body.allLists

  return lists;
}
