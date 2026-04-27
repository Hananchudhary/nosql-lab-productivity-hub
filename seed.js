// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  // =============================================================================
  //  TODO: Insert your seed data below.
  //
  //  Hints:
  //    - Hash passwords:   const hash = await bcrypt.hash('password123', 10);
  //    - Capture inserted ids:
  //        const u = await db.collection('users').insertOne({ ... });
  //        const userId = u.insertedId;
  //    - Use those ids when inserting projects/tasks/notes.
  //    - Demonstrate schema flexibility: include at least one optional field
  //      on SOME documents but not all (e.g. dueDate on some tasks only).
  //
  //  Sample task shape:
  //    {
  //      ownerId: <ObjectId>,
  //      projectId: <ObjectId>,
  //      title: "Write report introduction",
  //      status: "todo",
  //      priority: 3,
  //      tags: ["writing", "urgent"],
  //      subtasks: [
  //        { title: "Outline sections", done: true },
  //        { title: "Draft", done: false }
  //      ],
  //      createdAt: new Date()
  //    }
  // =============================================================================
  const passwordHash1 = await bcrypt.hash('password123', 10);
  const passwordHash2 = await bcrypt.hash('secure456', 10);

  const user1 = await db.collection('users').insertOne({
    email: 'alice@example.com',
    passwordHash: passwordHash1,
    name: 'Alice',
    createdAt: new Date()
  });

  const user2 = await db.collection('users').insertOne({
    email: 'bob@example.com',
    passwordHash: passwordHash2,
    name: 'Bob',
    createdAt: new Date()
  });

  const user1Id = user1.insertedId;
  const user2Id = user2.insertedId;
  
  const projects = await db.collection('projects').insertMany([
    {
      ownerId: user1Id,
      name: 'Website Redesign',
      description: 'Revamp company website',
      archived: false,
      createdAt: new Date()
    },
    {
      ownerId: user1Id,
      name: 'Marketing Campaign',
      archived: false,
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      name: 'Mobile App',
      description: 'Build new mobile app',
      archived: false,
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      name: 'Internal Tools',
      archived: true,
      createdAt: new Date()
    }
  ]);

  const projectIds = Object.values(projects.insertedIds);

  await db.collection('tasks').insertMany([
    {
      ownerId: user1Id,
      projectId: projectIds[0],
      title: 'Design homepage',
      status: 'todo',
      priority: 3,
      tags: ['design', 'ui'],
      subtasks: [
        { title: 'Wireframe', done: true },
        { title: 'Mockup', done: false }
      ],
      createdAt: new Date(),
      dueDate: new Date() // optional field example
    },
    {
      ownerId: user1Id,
      projectId: projectIds[1],
      title: 'Prepare ads',
      status: 'in-progress',
      priority: 2,
      tags: ['marketing'],
      subtasks: [
        { title: 'Copywriting', done: false }
      ],
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      projectId: projectIds[2],
      title: 'Setup backend',
      status: 'todo',
      priority: 4,
      tags: ['backend'],
      subtasks: [],
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      projectId: projectIds[2],
      title: 'Implement login',
      status: 'in-progress',
      priority: 5,
      tags: ['auth'],
      subtasks: [
        { title: 'JWT setup', done: true },
        { title: 'OAuth', done: false }
      ],
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      projectId: projectIds[3],
      title: 'Refactor codebase',
      status: 'done',
      priority: 1,
      tags: ['cleanup'],
      subtasks: [],
      createdAt: new Date()
    }
  ]);

  await db.collection('notes').insertMany([
    {
      ownerId: user1Id,
      projectId: projectIds[0],
      content: 'Discuss homepage layout with team',
      tags: ['ui', 'backend'],
      createdAt: new Date()
    },
    {
      ownerId: user1Id,
      content: 'Random idea: add blog section',
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      projectId: projectIds[2],
      content: 'API structure finalized',
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      content: 'Remember to optimize queries',
      createdAt: new Date()
    },
    {
      ownerId: user1Id,
      projectId: projectIds[1],
      tags: ['design'],
      content: 'Campaign launch next week',
      createdAt: new Date()
    }
  ]);

  console.log('TODO: implement seed.js');
  process.exit(0);
})();
