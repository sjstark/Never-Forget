
document.addEventListener('DOMContentLoaded', ()=> {

    let caretToggle = document.getElementsByClassName('caret');

    caretToggle = Array.from(caretToggle)
    
    console.log(caretToggle)
    
    // caretToggle.forEach(el, ()=> {
    //     el.addEventListener('click', ()=> {
    //         console.log(el)
    //         let parentEl = el.parentElement.querySelector('.nested');
    //         parentEl.classList.toggle('.active')
    
    //         el.classList.toggle('caret-down')
    //     })
    // })

    caretToggle.forEach(caret => {
        console.log('hit1')
        console.log(caret)
        caret.addEventListener('click', ()=> {
            console.log('hit2')
            // let parentEl = el.parentElement.querySelector('.nested');
            let parentTreeDOM = caret.parentElement.parentElement;
            console.log(parentTreeDOM)
            console.log('hit3')
            let nestedDOM = parentTreeDOM.getElementsByClassName('nested')
            console.log(nestedDOM)
            nestedDOM[0].classList.toggle('nested--inactive')

            caret.classList.toggle('caret-down')
    })
    })
    // console.log('hit1')
    // console.log(caretToggle[0])
    // caretToggle[0].addEventListener('click', ()=> {
    //     console.log('hit2')
    //     // let parentEl = el.parentElement.querySelector('.nested');
    //     let parentTreeDOM = caretToggle[0].parentElement.parentElement;
    //     console.log(parentTreeDOM)
    //     console.log('hit3')
    //     let nestedDOM = parentTreeDOM.getElementsByClassName('nested')
    //     console.log(nestedDOM)
    //     nestedDOM[0].classList.toggle('active')

    //     caretToggle[0].classList.toggle('caret-down')
    // })


})

