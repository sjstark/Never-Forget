let demoButton = document.querySelector('#demobtn')

demoButton.addEventListener('click', (e)=> {

  e.preventDefault();

  fillForm()
})

const fillForm = async () => {
  const demoUser = {
    email: 'demo@user.com',
    password: 'P@ssw0rd'
  }

  for(let key in demoUser) {

    let value = demoUser[key]
    let field = document.querySelector(`#${key}`)
    for(let i = 0; i <= value.length; i++) {
      field.value = value.slice(0,i)
    }

  }
}
