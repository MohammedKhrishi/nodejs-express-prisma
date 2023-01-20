import express, { urlencoded } from 'express';
import { body, check, validationResult } from 'express-validator';
import asyncHandler  from 'express-async-handler';
// create express instance
const app = express();
const port=process.env.PORT || 3000;

// extract json data .. has a in-built body-parser module in express.json();
app.use(express.json());
app.use(express.urlencoded({'extended':'true'}))

// setting up a RESTful API for a mini project for nodejs courseWork organised by GazaSkyGeeks


const tasks=[
    {id:1,

     title:'first day course', 

     description:"welocme to my first task",

      isCompleted: true
    },

    {id:2,

    title:'second day course',
    
    description:"welocme to my second task",
    
    isCompleted: true

    },

    {id:3,
        
    title:'third day course',
    
    description:"welocme to my third task", 
    
    isCompleted: true

    }
];

app.get('/api/tasks', asyncHandler (async(req,res)=>{

    try{
        res.status(200).json(tasks)

    } catch(error){

    console.log(error.stack);
    res.status(404);
    res.json({message:"something went wrong"})
    }
}))

app.get('/api/tasks/:id', async (req,res)=>{

    try{
        const {id} =await req.params;
        const taskID= await tasks.find((element)=>element.id== req.params.id);
        res.status(200).json(tasks[id-1])
    } catch(error){
    res.status(500);
    res.json({message:"something went wrong"})
    }
})

app.post('/api/tasks/SubmitTask', check('title').exists().isLength({ min: 14}).withMessage('must be at least 14 chars long')
.matches(/\d/).withMessage('must contain a number'),body('desciption').exists().isLength({min: 20}).withMessage("please write at least 20 characters"),
async(request, response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    // const{id,title,description,isCompleted}= await request.body;
    try {const newTask= await {
        id:request.body.id,
        title:request.body.title,
        description:request.body.description,
        isCompleted:request.body.isCompleted
    };

    tasks.push(newTask);
    response.status(201).json(tasks);
} catch(error){
    response.status(404).json({message:message.error});
    }
  });

  
app.put('/put/tasks/:id', async (request, response) => {
    const {id} =await req.params;
    // retrieve the  parameters value
    if (!tasks[id]){
        response.status(404, 'The task is not found').send();
    } else{
        const updatedTaskTitle=request.body.title;
        tasks[id].title = updatedTaskTitle;
        response.status(204).json(updatedTaskTitle).send({message:"done!"});
    }
  });
  

app.delete('/delete/tasks/:id', async (request, response) => {
    const {id} = await request.params;
    if(tasks.filter(task => task.id == id).length !== 0){
      tasks = tasks.filter(task => task.id !== id);
      response.status(200).json({message:"task has been deleted successfully"});
    }else{
      response.status(404).json({message:"something went wrong"});
    }
  });

app.patch('/patch/tasks/:id', async (request, response) => {
    try {
     const {id} = await req.params;
     const taskToUpdate= await tasks.find((element)=>element.id== req.params.id);
     const taskIndex=indexOf(taskToUpdate);
     const taskObjectUpdated=Object.assign(taskToUpdate,req.body)
     tasks[taskIndex]=taskToUpdate;
    response.status(200).send(tasks);
    } catch (error) {
      response.status(404).send({message:"something went wrong"});
    }
  });

app.listen(port, () =>
  console.log(`🚀 Server ready at: http://localhost:${port}`)
);
