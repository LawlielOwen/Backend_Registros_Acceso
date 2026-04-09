import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

// 🔥 OBTENER USUARIOS
router.get("/", async (req: Request, res: Response) => {
  try {

    const [rows]: any = await pool.query("CALL sp_obtener_usuarios()");

    res.json(rows[0]);

  } catch (error: any) {
    console.error("ERROR DETALLADO:", error);

    res.status(500).json({
      message: "Error al obtener usuarios",
      error: error.message
    });
  }
});

export default router;

// 🔥 ESTADÍSTICAS
router.get("/stats", async (req: Request, res: Response) => {
  try {
    const [rows]: any = await pool.query("CALL sp_estadisticas_usuarios()");
    res.json(rows[0][0]);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener estadísticas"
    });
  }
});

// 🔥 CREAR USUARIO
router.post("/", async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, telefono, correo, email, password, rol } = req.body;

    if (!nombre || !apellido || !email || !password || !rol) {
      return res.status(400).json({
        message: "Campos obligatorios faltantes"
      });
    }

    await pool.query(
      "CALL sp_crear_usuario(?, ?, ?, ?, ?, ?, ?)",
      [nombre, apellido, telefono, correo, email, password, rol]
    );

    res.json({
      message: "Usuario creado correctamente"
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear usuario",
      error: error.message
    });
  }
});

// 🔥 ACTUALIZAR USUARIO
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, telefono, correo, email, rol } = req.body;

    await pool.query(
      "CALL sp_actualizar_usuario(?, ?, ?, ?, ?, ?, ?)",
      [id, nombre, apellido, telefono, correo, email, rol]
    );

    res.json({
      message: "Usuario actualizado correctamente"
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar usuario",
      error: error.message
    });
  }
});

// 🔥 CAMBIAR ESTADO
router.patch("/:id/estado", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({
        message: "El estado es obligatorio"
      });
    }

    await pool.query(
      "CALL sp_cambiar_estado_usuario(?, ?)",
      [id, estado]
    );

    res.json({
      message: "Estado actualizado correctamente"
    });

  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Error al cambiar estado",
      error: error.message
    });
  }
});