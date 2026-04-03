import { Router, Request, Response } from "express";
import pool from "../config/db";
import { Person } from "../models/example";

const router = Router();

// GET /api/persons — get all persons
router.get("/", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM persons");
    res.json(rows as Person[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching persons" });
  }
});

// GET /api/persons/:id — get one person by id
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<any[]>(
      "SELECT * FROM persons WHERE id = ?",
      [id],
    );

    if ((rows as Person[]).length === 0) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.json((rows as Person[])[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching person" });
  }
});

// POST /api/persons — create a new person
router.post(
  "/",
  async (req: Request<{}, {}, Omit<Person, "id">>, res: Response) => {
    try {
      const { name, age } = req.body;

      if (!name || age === undefined) {
        return res.status(400).json({ message: "name and age are required" });
      }

      const [result] = await pool.query<any>(
        "INSERT INTO persons (name, age) VALUES (?, ?)",
        [name, age],
      );

      const newPerson: Person = { id: result.insertId, name, age };
      res.status(201).json(newPerson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating person" });
    }
  },
);

// PUT /api/persons/:id — update an existing person
router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, Omit<Person, "id">>,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const { name, age } = req.body;

      if (!name || age === undefined) {
        return res.status(400).json({ message: "name and age are required" });
      }

      const [result] = await pool.query<any>(
        "UPDATE persons SET name = ?, age = ? WHERE id = ?",
        [name, age, id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Person not found" });
      }

      const updatedPerson: Person = { id: Number(id), name, age };
      res.json(updatedPerson);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating person" });
    }
  },
);

// DELETE /api/persons/:id — delete a person
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<any>("DELETE FROM persons WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Person not found" });
    }

    res.json({ message: `Person ${id} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting person" });
  }
});

export default router;
