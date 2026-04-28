import React, { useEffect, useState } from 'react';

function Main(){
    // ! useState variables
    const[data, setData] = useState([]) // * variable that stores our applications.
    const[addApplication, setAddApplication] = useState("") // * variable stores our query with the informations about an application we will add
    const[newStatus, setNewStatus] = useState("") // * variable that stores the new status we want to update to
    

    // * useEffects so get data run on start
    useEffect(() => {
        getData();
    }, []); // * brackets makes it run on start and done


    // ! function to get the data from the database(backend)
    function getData(){ 
        fetch(`http://127.0.0.1:5001/`)  // * fetch the backend home route
            .then(response => response.json()) // * then jsonify the response
            .then(data => setData(data)) // * then take data and add it to our data variable
    }

    // ! function to send the data to the backend and add it to the database
    function sendData(){
        const separate = addApplication.split("/"); // * this splits the sections of the input by placing a /


        // ? tiny error handling...
        if (separate.length < 4) { // * if the input is separated into more than 4 sections
            alert("Format must be: Company/Stack/Date/Status"); // * show correct format.
            return;
        }

        // ? removing extra spaces
        const company = separate[0].trim(); // * we are calling the first separation company and trimming it so theres no extra space
        const stack = separate[1].trim(); // * same
        const date = separate[2].trim(); // * same
        const status = separate[3].trim(); // * same


        // ! back to fetching

         fetch(`http://127.0.0.1:5001/add_application/${company}/${stack}/${date}/${status}`) // * fetch the backend using the add_application route and add the new consts as arguments
            .then(response => response.json())
            .then(() => {
                setAddApplication("") // * cleans input (optional usestates already does kinda)
                getData(); // * update the screen with the new application by calling getData
            })
          }
 

      // ! function to delete an application
      function deleteData(id){
        fetch(`http://127.0.0.1:5001/delete/${id}`)  // * fetch the backend using delete route.
            .then(response => response.json())
            .then(() => {
                getData(); // * update the screen with the new application by calling getData
            })}

      
      // ! function to update the status
      function updateStatus(id, newStatusValue){
        // * Usamos newStatusValue que vem do clique do botão
        fetch(`http://127.0.0.1:5001/change_status/${id}/${newStatusValue}`) 
            .then(response => response.json())
            .then(() => {
                setNewStatus("") // * limpa a variável após o update
                getData(); // * update the screen with the new application by calling getData
            })
      }


   return (
 <div className='return-container'>


    <div className='input-container' id='addApplication'>

      <input 
       className='input'
       id='addApp-input'
       type="text"
       value={addApplication}
       onChange={(userTyped) => setAddApplication(userTyped.target.value)}
       placeholder='Add Application:Company/Stack/Date/Status'
       />
       <button
       id='button-sendData'
       onClick={sendData}>
       Add
       </button>
            
    </div>





  <div className='application-container'>

    <h1>Applications</h1>
    {data.map((application) => ( // * for(map) application(Application) in data(data)
      <div key={application.id}> {/* * using id so react can know what to use as a reference */}
        <h3>{application.company} - {application.stack}</h3> {/* * display company and stack */}
        <p>{application.date} | {application.status}</p> {/* * display date and and status */}
        <hr/>
        <button id='deleteButton' onClick={() => deleteData(application.id)}>Delete</button> {/* * button to delete application using the deleteData function and passing the id of the application we want to delete */}
        
        <div className='updateStatus'>
        <input
        id='inputchangestatus' 
        type="text" 
        onChange={(userTyped) => setNewStatus(userTyped.target.value)}
        placeholder='Update Status'/>
        
        <button id='changestatus-button' onClick={() => updateStatus(application.id, newStatus)}>
            Update Status
        </button>
        </div>
       </div>
    ))}

  </div>


 </div>
);
}

export default Main;