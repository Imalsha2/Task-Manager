import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import routerTasks from "./routes/tasks";
import sequelize from "./db";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

app.use('/api/tasks', routerTasks);

app.get('/', (req, res) => res.json({ ok: true, api: '/api/tasks' }));

async function start() {
  try {
    try {
      const qi = sequelize.getQueryInterface();
      await qi.dropTable('tasks_backup');
      console.log('Dropped existing tasks_backup table (if it existed)');
    } catch (dropErr) {
    }

    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
