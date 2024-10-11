const endPoint = `https://uunoyalmreaywqwsrymh.supabase.co/rest/v1/management`
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1bm95YWxtcmVheXdxd3NyeW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgzNDczNzAsImV4cCI6MjA0MzkyMzM3MH0.t_yzEGMttCDR2oITWMF_YYLdibKrOcXbSnXE29-WHg8`


let modal = new bootstrap.Modal(document.getElementById("taskModal"))
getTasks()

async function getTasks() {

    let response = await fetch(endPoint, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })

    let data = await response.json()
    renderTasks(data)

}

function renderTasks(data) {

    let tableLayout = ` <tr>
                            <th>Name</th>
                            <th>Descrition</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        <tr>`

    for (let i = 0; i < data.length; i++) {
        tableLayout += ` <tr>
                            <td>${data[i].taskname}</td>
                            <td>${data[i].description}</td>
                            <td>${data[i].date}</td>
                            <td>${data[i].status}</td>
                            <td> <button onclick="showModal(${data[i].id})" class="btn btn-warning"> Edit </button>  </td>
                            <td> <button onclick="deleteTask(${data[i].id})" class="btn btn-danger"> Delete </button>  </td>
                        <tr> `

    }

    reportTasks.innerHTML = tableLayout

}

async function postTask() {

    event.preventDefault()

    let taskname = inputTaskname.value
    let description = inputDescription.value
    let date = inputDate.value
    let status = inputStatus.value

    let jsonData = {
        taskname,
        description,
        date,
        status
    }
    console.log(jsonData)

    let response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'apikey': token,
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    })

    if (response.status >= 200 && response.status <= 299) {
        console.log("Task Done")
        getTasks()
    } else {
        console.log("Task was not done")
        console.log(response.statusText)
    }


}


async function showModal(id) {

    let url = `${endPoint}?id=eq.${id}`

    console.log(url)

    let response = await fetch(url, {
        method: 'GET',
        headers: {
            'apikey': token,
            'Authorization': token
        }
    })


    if (response.ok) {
        let data = await response.json();
        inputId.value = data[0].id
        inputTaskname1.value = data[0].taskname
        inputDescription1.value = data[0].description
        inputDate1.value = data[0].date
        inputStatus1.value = data[0].status
        
    } else {
        console.log("Fetch error")
    }

    modal.show()

}

async function patchTask() {

    let id = inputId.value
    let taskname = inputTaskname1.value
    let description = inputDescription1.value
    let date = inputDate1.value
    let status = inputStatus1.value

    let url = `${endPoint}?id=eq.${id}`

    let jsonBody = {
        taskname,
        description,
        date,
        status
       
    }
    console.log("patchTask")

    console.log(url)

    let response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': token,
            'Athorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonBody)
    })
    console.log(response.ok)

    if (response.ok) {
        console.log("Task has been updated")
        getTasks()
        modal.hide()

        /*Whipe the inputs */

        inputId.value = ""
        inputTaskname1.value = ""
        inputDescription1.value = ""
        inputDate1.value = ""
        inputStatus1.value = ""
        

    } else {
        console.log("Task hasn t been updated")
        let responseBody = await response.json()
        console.log(responseBody)
    }



}

async function deleteTask(id){

    let url = `${endPoint}?id=eq.${id}`

    let response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'apikey': token,
            'Athorization': token
        }
    })

    if(response.ok){
        console.log("Task has been removed")
        getTasks()
    }else{
        let responseBody = await response.json()
        console.log("Error deleting object")
        console.log(responseBody)
    }

}