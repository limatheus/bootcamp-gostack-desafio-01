const express = require('express');

const server = express();

server.use(express.json());

requestsReceived = 0;

const projects = [
  {
    id: '1',
    title: 'Awesome project 1',
    tasks: ['Create', 'Read', 'Update', 'Delete']
  }
];

/*
 *Middleware to check if a project exists
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

/*
 *Middleware to count how much requests was received
 */
server.use((req, res, next) => {
  requestsReceived++;

  console.log(`Requests received: ${requestsReceived}`);

  return next();
});

/*
 * Projects list
 */
server.get('/projects', (req, res) => {
  return res.json(projects);
});

/*
 * Return a project by given ID
 */
server.get('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  return res.json(project);
});

/*
 * Create a new project
 */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.unshift(project);

  return res.json(project);
});

/*
 * Updates a existing project by given ID
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.title = title;

  return res.json(project);
});

/*
 * Deletes a existing project by given ID
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/*
 * Add a new task in a existing project
 */

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);

console.log('Server started at http://localhost:3000');
