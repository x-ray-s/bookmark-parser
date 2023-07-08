const $title = document.querySelectorAll('.folder > h5')

Object.values($title).forEach((item) => {
    item.addEventListener('click', (e) => {
        item.parentNode.classList.toggle('open')
    })
})
