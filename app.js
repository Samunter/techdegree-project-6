const express = require('express');
const data = require('./data.json');

const app = express();

// Tell express which template engine to use
app.set('view engine', 'pug');

// Add static asset middleware and route static server to /static
app.use('/static', express.static('public'));

app.get('/', (_req, res) => {
  res.render('index', data);
});

app.get('/about', (_req, res) => {
  res.render('about');
});

// Load the project page. URL specifies which project, pug template is given
// access to that project's json data
// If the specified project doesn't exist, don't load page and execute next middleware
app.get('/projects/:id', (req, res, next) => {
  const id = req.params.id;
  const project = data.projects.filter(project => project.id === id)[0];

  if (!project) {
    next();
  }

  res.render('project', project);
});

// If the URL doesn't match a get request, create an error and pass it to error
// handling middleware
app.use((_req, _res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling middleware. Renders 'error' pug template
app.use((err, _req, res, _next) => {
  err.status = err.status || 500; // Ensure there's always a status code.
  err.message = err.message || 'Internal Server Error'; // Ensure there's always an error message.

  res.status(err.status);
  res.render('error', { error: err });
});

// Initialize server
app.listen(3000, () => {
  console.log('Server Started! WoooooooooooooooooooooOOO!');
});
