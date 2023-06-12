const express = require('express');
const app = express();
const cors = require('cors');

// Importing routers
const instructorRouter = require('./routers/Instructors'); // Router for '/instructors' endpoint
const classesRouter = require('./routers/classes'); // Router for '/classes' endpoint
const selectedClassRouter = require('./routers/selectedClasses'); // Router for '/selected-classes' endpoint
const jwtRouter = require('./routers/jwt'); // Router for '/jwt' endpoint
const paymentRouter = require('./routers/payments'); // Router for '/payments' endpoint
const userRouter = require('./routers/users'); // Router for '/users' endpoint

const port = process.env.PORT || 5000;

// Middleware configuration
const corsConfig = {
  origin: '*', // Allows requests from any origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] // Allowed HTTP methods
}
app.use(cors(corsConfig))
app.options("", cors(corsConfig))
app.use(express.json());

// Registering routers
app.use('/jwt', jwtRouter) // Mounts the jwtRouter at '/jwt' endpoint
app.use('/users', userRouter) // Mounts the userRouter at '/users' endpoint
app.use('/instructors', instructorRouter) // Mounts the instructorRouter at '/instructors' endpoint
app.use('/classes', classesRouter) // Mounts the classesRouter at '/classes' endpoint
app.use('/selected-classes', selectedClassRouter) // Mounts the selectedClassRouter at '/selected-classes' endpoint
app.use('/payments', paymentRouter) // Mounts the paymentRouter at '/payments' endpoint

// Default route
app.get('/', (req, res) => {
  res.send('App is listening..')
})

// Server start
app.listen(port, () => {
  console.log(`Foreign language camp is listening ${port}`);
})
