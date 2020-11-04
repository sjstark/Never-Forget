
document.addEventListener('DOMContentLoaded', ()=> {

    // ------HANDLE TOGGLE FOR TREE VIEWS-----//
    treeView()


    //-------HANDLE EMPHASIS ON SELECTED LISTS AND SECTIONS------//
    emphasisText()

})


function treeView() {
    let caretToggle = document.getElementsByClassName('caret');

    caretToggle = Array.from(caretToggle)

    caretToggle.forEach(caret => {
        // console.log('hit1')
        // console.log(caret)
        caret.addEventListener('click', ()=> {
            // console.log('hit2')
            // let parentEl = el.parentElement.querySelector('.nested');
            let parentTreeDOM = caret.parentElement.parentElement;
            console.log(parentTreeDOM)
            // console.log('hit3')
            let nestedDOM = parentTreeDOM.getElementsByClassName('nested')
            // console.log(nestedDOM)
            nestedDOM[0].classList.toggle('nested--inactive')

            caret.classList.toggle('caret-down')
        })
    })
 
}


function emphasisText() {
    let listMenu = document.querySelector('.list-menu');

    let texts = document.querySelectorAll('li');

    console.log(texts);

    let textList = [...texts];

    textList.forEach(el => {
        console.log('reached for each emphasisText')
        el.addEventListener('click', ()=> {
            console.log('reached event listener')
            emphasisHelperFunction(textList, el)
        })
    })
}

function emphasisHelperFunction(textList, el) {
    textList.forEach(item => {
        console.log('reached for each helper function')
        item.classList.remove('list-tree-li--emphasis')
    })
    console.log('got to end of helper function')
    el.classList.add('list-tree-li--emphasis')
}