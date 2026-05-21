const baseURL = "http://localhost:3000/dogs/"
document.addEventListener("DOMContentLoaded", () => {
  appendDogs()

  document.getElementById("dog-form").addEventListener("submit", (e) => {
    e.preventDefault()
    submitEdits(parseInt(e.target.elements.submit.getAttribute("data-dog-id")))
    e.target.reset()
  })
})

function appendDogs() {
  let tableBody = document.getElementById("table-body")
  fetch(baseURL)
    .then((res) => res.json())
    .then((dogs) => {
      const dogEles = []
      for (const dog of dogs) {
        const el = (tag) => document.createElement(tag)
        let dogRow = el("tr")
        let dogName = el("td")
        let dogBreed = el("td")
        let dogSex = el("td")
        let dogEdit = el("td")
        let editBtn = el("button")
        editBtn.textContent = "Edit Dog"
        dogName.textContent = dog.name
        dogBreed.textContent = dog.breed
        dogSex.textContent = dog.sex
        dogEdit.append(editBtn)
        dogEdit.addEventListener("click", (e) =>
          editDog(e.target.parentElement.parentElement),
        )

        dogRow.append(dogName, dogBreed, dogSex, dogEdit)
        dogRow.setAttribute("id", "dogRow" + dog.id)

        dogEles.push(dogRow)
      }

      tableBody.replaceChildren(...dogEles)
    })
}

function editDog(dogRow) {
  let dogForm = document.getElementById("dog-form")
  dogForm.elements.name.value = dogRow.children[0].textContent
  dogForm.elements.breed.value = dogRow.children[1].textContent
  dogForm.elements.sex.value = dogRow.children[2].textContent
  dogForm.elements.submit.setAttribute(
    "data-dog-id",
    dogRow.getAttribute("id").slice(6),
  )
}

function submitEdits(dogId) {
  let dogForm = document.getElementById("dog-form")

  if (
    dogForm.elements.sex.value !== "" &&
    dogForm.elements.breed.value !== "" &&
    dogForm.elements.name.value !== ""
  ) {
    fetch(baseURL + dogId, {
      method: "PATCH",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: dogForm.elements.name.value,
        breed: dogForm.elements.breed.value,
        sex: dogForm.elements.sex.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        appendDogs()
      })
  } else {
    alert("Please make sure the form is filled!")
  }
}
