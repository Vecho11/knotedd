const input = document.getElementById("input")
const form = document.getElementById("form")
const dataContainer = document.getElementById("data-container")
const addButton = document.getElementById("add-btn")
const plusButton = document.querySelector(".plus-btn")
const cancelButton = document.querySelector(".cancel-btn")
const modal = document.querySelector(".modal")
const toggleBtn = document.getElementById('toggle-btn')
const search = document.querySelector(".search-el")

let notes = []
let editingId = null

const retrieveData = JSON.parse(localStorage.getItem("note"))
notes = retrieveData || []
renderNotes()

function saveData(){
    localStorage.setItem("note", JSON.stringify(notes))
}

function getRandomColor() {
    let color = "hsl(" + Math.random() * 360 + ", 100%, 75%)";
    return color
}

function addNote(){

    const value = input.value.trim()
    const userInput = value

    if(userInput === ""){
        alert('Invalid data.')    
        return;
    }

    notes.push({
        id: Date.now(),
        note: userInput,
        date: new Date().toLocaleDateString(),
        bg: getRandomColor()
    })

    saveData()
    modal.classList.add('hidden')
    input.value = ""
}

function renderNotes(data = notes){

    if(notes.length === 0){
       return dataContainer.innerHTML = `<p class="empty-text">I left this space open… just in case you come back to it.</p>`
    } else{
    dataContainer.innerHTML = data.map(n => {
        return  `
            <div id="note-container" style="background-color:${n.bg}">
                <div class="note-text-container">
                    <p>${n.note}</p>
                </div>
                <div class="note-button-container">
                    <div>
                        <p class="date-text">${n.date}</p>
                    </div>
                    <div>
                        <button class="edit-button" data-action="edit" data-id="${n.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-button" data-action="delete" data-id="${n.id}">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
        }).join("")
    }
}


dataContainer.addEventListener('click', (e) => {
    e.preventDefault()
    
    const button = e.target.closest('button')
    if(!button) return;

    const action = button.dataset.action
    const id = Number(button.dataset.id)
    
    if(action === "delete"){
        deleteNote(id)
    }
    if(action === "edit"){
        editNote(id)
    }
})

function editNote(id){
    const data = notes.find(n => n.id === id)
    if(!data) return;

    input.value = data.note
    editingId = id
    modal.classList.remove('hidden')
    addButton.innerHTML = "SAVE EDIT"
}

function deleteNote(id){
    notes = notes.filter(n => n.id !== id)
    renderNotes()
    saveData()
}

form.addEventListener("submit", (e) => {
    e.preventDefault()

    if(editingId !== null){
        const note = notes.find(n => n.id === editingId)
        if(!note) return;
        
        modal.classList.add('hidden')
        note.note = input.value
        editingId = null;
        addButton.textContent = "ADD"
        saveData()

    }else{
        addNote()
    }

    renderNotes()
    form.reset()
})

plusButton.addEventListener("click", (e) => {
    e.preventDefault()
    modal.classList.remove('hidden')
})

cancelButton.addEventListener("click", (e) =>{
    e.preventDefault()
    modal.classList.add('hidden')
    form.reset()
    editingId = null
    addButton.textContent = "ADD"
})  


function updateBackground(isDark){
    document.body.classList.toggle("toggle-dark", isDark)

    toggleBtn.innerHTML = isDark 
    ? `<i class="fa-solid fa-sun"></i>`
    : `<i class="fa-solid fa-moon"></i>`
}

toggleBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("toggle-dark")
    localStorage.setItem('theme', isDark ? "dark" : "light")

    updateBackground(isDark)
})

window.addEventListener("DOMContentLoaded", () => {
    const saveTheme = localStorage.getItem('theme');
    let isDark = saveTheme === 'dark'

    updateBackground(isDark)
})

function SearchNotes(){
    const value = search.value.trim().toLowerCase()

    const data = notes.filter(n => {
        return n.note.toLowerCase().includes(value)
    })

    if(data.length === 0){
        dataContainer.innerHTML = `<p class="empty-text">No match data</p>`
    } else{
        renderNotes(data)
    }
}

search.addEventListener("input", SearchNotes)