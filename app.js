const ul=document.querySelector('ul');
const form=document.querySelector('form');

const db=firebase.firestore();

//adding data FROM firestore to FrontEnd

const addToUI=(todo,id)=>{
    const html=`
    <li data-id="${id}">
    <div>${todo.title}</div>
    <button class="btn btn-danger my-2">Finished</button>
    </li>
    `;
    ul.innerHTML+=html;

};
//Delete The LI tag from Front End using the id from the realtime listener
//When we are creating the LI elems in the above code
//We are attaching a data-id attribute,
//so in the realtime listener we check for this & delete it
const deleteFromUI=(id)=>{
    const li=document.querySelectorAll('li');
    li.forEach(elems=>{
        if(elems.getAttribute('data-id')===id){
            elems.remove();
        }
    })
}


//realtime listener for firestore & aupdates changes in UI if item is added in firestore
db.collection('todo').onSnapshot(snapshot=>{
    snapshot.docChanges().forEach(change=>{
        if(change.type==="added"){
            addToUI(change.doc.data(),change.doc.id)
        }else if(change.type==="removed"){
            deleteFromUI(change.doc.id);
        }
    })
})
    


//Adding the enetered value into firestore
const addTodo=(data)=>{
    db.collection('todo').add(data)
        .then(snapshot=>{
            //Testing Purposes
            console.log("Todo Added to db");
        })
};

//Getting data from form and adding it to the firestore
form.addEventListener('submit',e=>{
    e.preventDefault();
    const val={title: form.todo.value};
    //Need to update the db with this value
    //Sending the js object to addTodo since firestore takes in key value pairs
    addTodo(val);
    form.reset();
});


//Deleting LI tags from DB & UI
ul.addEventListener('click',e=>{
    if(e.target.tagName==="BUTTON"){
       const id=e.target.parentElement.getAttribute('data-id');
       //This is an async call it will return a promise

       db.collection('todo').doc(id).delete()
            .then(data=>{
                //This is for testing purpose
                console.log("Item Deleted From DB")})
            .catch(err=>console.log(err));
        
    }
});