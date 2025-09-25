import express from 'express';

const router = express.Router();

const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' }
]

router.get('/', (request, response) => {

    response.send({
        data: users,

    })
    
});

router.get ('/:userId', (request, response) => {
    const userId = request.params.userId;
    const user = users.find ((user) => user.id == userId);
    response.send (user);
});

router.post ('/', (request, response) => {
    const body = request.body;
    response.send (body);
    users.push (body);
});



export default router;