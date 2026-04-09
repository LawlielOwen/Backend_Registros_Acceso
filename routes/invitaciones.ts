import { Router, Request, Response } from "express";
import pool from "../config/db";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { nombre, motivo, telefono, fechaInicio, fechaFin } = req.body;


    if (!nombre || !motivo || !telefono || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }

    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinDate = new Date(fechaFin);

    if (fechaFinDate < fechaInicioDate) {
      return res.status(400).json({
        message: "La fecha fin no puede ser menor a la fecha inicio"
      });
    }



    const codigoQR = "INV-" + Date.now();

   

    const query = `
      INSERT INTO tbl_invitaciones
      (id_evento, id_punto, nombre_invitado, motivo_visita, telefono, codigo_qr, fecha_inicio, fecha_fin, estado, max_usos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      1, 
      1, 
      nombre,
      motivo,
      telefono,
      codigoQR,
      fechaInicio,
      fechaFin,
      "pendiente",
      1
    ]);

    // =========================
    // RESPUESTA
    // =========================

    res.json({
      message: "Invitación creada correctamente",
      codigo_qr: codigoQR
    });

  } catch (error: any) {
  console.error("ERROR DETALLADO:", error);

  res.status(500).json({
    message: "Error al crear invitación",
    error: error.message
  });
}
});

export default router;