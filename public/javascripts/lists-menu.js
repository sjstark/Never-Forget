
// document.addEventListener('DOMContentLoaded', async ()=> {

//     //-------ADD LISTS THAT THE PERSON CAN ACCESS IN THE DOM------//
//     await loadLists()


//     // ------HANDLE TOGGLE FOR TREE VIEWS-----//
//     treeView()


//     //-------HANDLE EMPHASIS ON SELECTED LISTS AND SECTIONS------//
//     emphasisText()


//     // addLists()

//     await countTotalTasks()

//     await countListTasks()


// })


export const treeView = () => {
    let caretToggle = document.getElementsByClassName('caret');

    caretToggle = Array.from(caretToggle)

    caretToggle.forEach(caret => {
        // console.log('hit1')
        // console.log(caret)
        caret.addEventListener('click', (event)=> {
            // console.log('hit2')
            // let parentEl = el.parentElement.querySelector('.nested');
            let parentTreeDOM = caret.parentElement.parentElement;
            // console.log(parentTreeDOM)
            // console.log('hit3')
            let nestedDOM = parentTreeDOM.getElementsByClassName('nested')
            // console.log(nestedDOM)
            nestedDOM[0].classList.toggle('nested--inactive')
            event.stopPropagation()
            caret.classList.toggle('caret-down')
        })
    })

}

export const emphasisText = () => { // <-- add loadLostsHelperFunc
    let listMenu = document.querySelector('.list-menu');

    let texts = document.querySelectorAll('li');

    // console.log(texts);

    let textList = [...texts];

    textList.forEach(el => {
        // console.log('reached for each emphasisText')
        el.addEventListener('click', ()=> {
            // console.log('reached event listener')
            emphasisHelperFunction(textList, el)
            // loadListsHelperFunc() 
        })
    })
}

export const emphasisHelperFunction = (textList, el) => {
    textList.forEach(item => {
        // console.log('reached for each helper function')
        item.classList.remove('list-tree-li--emphasis')
    })
    // console.log('got to end of helper function')
    el.classList.add('list-tree-li--emphasis')
}

export const loadLists = async() => {
    let route = '/lists'

    //Fetching and uppacking response
    let res = await fetch(route);
    let resObj = await res.json();
    let objArray = resObj.allLists

    //Finding list of lists in menu and clearing it
    let listTree = document.querySelector('#add-lists-here')
    listTree.innerHTML = '';
    

    //Adding lists to tree
    objArray.forEach(list => {
        // console.log(list)
        let htmlList = document.createElement('li')
        htmlList.classList.add('list-menu-flex')
        htmlList.id = list.id
        htmlList.innerHTML = `
        ${list.title} 
        <span class="listCount" id='${list.id}'></span>
        <span class='list-edit-carrot'>V</span>`
        listTree.appendChild(htmlList) 
    }) 
}

export const countTotalTasks = async() => {
    //Grab All Tasks span
    let taskCount = document.querySelector('.allTaskCount');
    // console.log(taskCount)
    // console.log(taskCount.innerHTML)

    //Fetch and parse request from API
    let route = '/tasks'

    let req = await fetch(route)
    let res = await req.json();
    let taskArray = res.allTasks
    // console.log(taskArray)

    let count = taskArray.length
    // console.log(count)

    taskCount.innerText = count
}

export const countListTasks = async() => {
    //Grab all lists count spans
    let listCounts = document.querySelectorAll('.listCount');

    let listCountsArray = [...listCounts]

    //Iterate through spans, grab their list.length, and set span
    listCountsArray.forEach(async (el) => {
        let listId = el.id;
        // console.log(el)
        let route = `lists/${listId}`

        let req = await fetch(route)
        let res = await req.json()
        // console.log(res)
        let {allTasks} = res
        // console.log(allTasks)

        let count = allTasks.length
        // console.log(count)

        el.innerHTML = count;

    })
}

export const addLists = () => {
    //Find add button in DOM
    let addButton = document.querySelector('.add-list-button');
    let modal = document.querySelector('.add-lists-modal-container');
    let submitButton = document.querySelector('.add-list-submit');
    let closeButton = document.querySelector('.add-list-close')

    //Add event listener to make modal appear
    addButton.addEventListener('click', (event) => {
        event.stopPropagation()

        modal.classList.add('add-lists-modal-container--shown')

        
    })  

    //After user submits new list, hide modal and update list menu
    submitButton.addEventListener('click', async (event)=> {

        event.stopPropagation()

        let title = document.querySelector('#add-list-title').value
        let csrfForm = document.querySelector('#add-list-csrf').value

        await submitForm(title,csrfForm)
       
        modal.classList.remove('add-lists-modal-container--shown');
        await loadLists()
        await countListTasks()

        //reset modal value
        document.querySelector('#add-list-title').value = ''


    })

    //Add event listener for closing the modal
    closeButton.addEventListener('click', ()=> {
        modal.classList.remove('add-lists-modal-container--shown')
         //reset modal value
         document.querySelector('#add-list-title').value = ''
    })

};

const submitForm = async(title, csrfToken) => {
    const body = {title, _csrf:csrfToken}
    const options = {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)}
    let res = await fetch('/lists', options);
    
}