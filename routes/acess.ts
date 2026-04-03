import { Router, Request, Response } from "express";
import { Access } from "../models/acess";
import pool from "../config/db";
const router = Router();


//
router.get("/", async (_req: Request, res: Response) => {
  try {
    const page = parseInt(_req.query.page as string) || 1;
    const limit = parseInt(_req.query.limit as string) || 15;
    const offset = (page - 1) * limit;
    const [countResult] = await pool.query<any[]>("SELECT COUNT(*) as total FROM vista_registros_acceso");
    const totalRecords = countResult[0].total;
    const totalPages = Math.ceil(totalRecords / limit);
    const query = `
  SELECT * FROM vista_registros_acceso 
  WHERE DATE(fecha_acceso) = CURDATE()
  ORDER BY fecha_acceso DESC 
  LIMIT ? OFFSET ?
`;
    const [rows] = await pool.query<any[]>(query, [limit, offset]);
    res.json({
      data: rows as Access[],
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching access records" });
  }
});

router.get("/count", async (req: Request, res: Response) => {
  try {
    const { fecha, id_punto, exitoso } = req.query;
    let query = `
      SELECT 
        COUNT(CASE WHEN tipo_acceso = 'Entrada' THEN 1 END) AS entradas,
        COUNT(CASE WHEN tipo_acceso = 'Salida' THEN 1 END) AS salidas
      FROM tbl_registros_acceso
      WHERE 1=1
    `;
    const params: any[] = [];
    if (id_punto) {
      query += " AND id_punto = ?";
      params.push(Number(id_punto));
    }
    if (fecha) {
      query += " AND DATE(fecha_acceso) = ?";
      params.push(fecha);
    } else {
      query += " AND DATE(fecha_acceso) = CURDATE()";
    }

    if (exitoso !== undefined) {
      query += " AND exitoso = ?";
      params.push(Number(exitoso));
    }
    const [rows] = await pool.query<any[]>(query, params);
    const counts = rows[0];

    res.json({
      entradas: counts.entradas || 0,
      salidas: counts.salidas || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching access count" });
  }
});
export default router;
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { busqueda, tipo_acceso, exitoso, fecha, id_punto, page, limit } = req.query;
    const pagina = parseInt(page as string) || 1;
    const limite = parseInt(limit as string) || 15;
    const offset = (pagina - 1) * limite;
    let query = "call sp_buscar_filtrar_acceso(?,?,?,?,?,?,?)";

    const params: any[] = [
      busqueda ? busqueda : null,
      tipo_acceso ? tipo_acceso : null,
      exitoso !== undefined ? Number(exitoso) : null,
      fecha ? fecha : null,
      id_punto ? Number(id_punto) : null,
      limite,
      offset
    ];

    const [rows] = await pool.query(query, params);
    const result = (rows as any[])[0];
  const totalRecords = result.length > 0 ? result[0].total_filtrados : 0;
    const totalPages = Math.ceil(totalRecords / limite);
    res.json({
      data: result,
      pagination: {
        currentPage: pagina,
        limit: limite,
        totalRecords: totalRecords, 
        totalPages: totalPages      
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error searching access records" });
  }
});
router.post("/register", async (req: Request<{}, {}, Omit<Access, "id">>, res: Response) => {
  try {
    const { matricula_identificacion, id_punto, exitoso, tipo_acceso, tipo_validacion, motivo_rechazo } = req.body;
    if (!matricula_identificacion || !id_punto || exitoso === undefined || !tipo_acceso || !tipo_validacion) {
      return res.status(400).json({ message: "Ingresa todos los datos requeridos" });
    }
    const [rows] = await pool.query<any>("CALL sp_registrar_acceso(?,?,?,?,?,?)", [
      matricula_identificacion,
      id_punto,
      exitoso,
      tipo_acceso,
      tipo_validacion,
      motivo_rechazo
    ]);

    const resultadoSP = rows[0][0];
    if (resultadoSP.v_id_usuario === null && resultadoSP.v_id_invitacion === null) {
      return res.status(404).json({
        message: "Identificador o matricula no encontradas."
      });
    }
    res.status(201).json({ message: "Acceso validado y registrado con éxito" });

  } catch (error) {
    console.error("Error al registrar acceso:", error);
    res.status(500).json({ message: "Error interno del servidor al registrar el acceso" });
  }
});
router.post("/register-qr", async (req: Request<{}, {}, Omit<Access, "id">>, res: Response) => {
  try {
    const { qr_code, id_punto, tipo_acceso } = req.body;
    const [rows] = await pool.query<any>("CALL sp_registrar_acceso_qr(?,?,?)", [
      qr_code,
      id_punto,
      tipo_acceso
    ]);
    const resultadoSP = (rows as any[])[0][0];
    if (resultadoSP.id_usuario === null && resultadoSP.id_invitacion === null) {
      return res.status(404).json({
        success: false,
        message: resultadoSP.mensaje
      });
    }

    if (resultadoSP.exitoso === 1) {
      res.status(200).json({
        success: true,
        message: resultadoSP.mensaje,
        data: resultadoSP
      });
    } else {
      res.status(403).json({
        success: false,
        message: resultadoSP.mensaje
      });
    }

  } catch (error) {
    console.error("Error al registrar acceso con QR:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al registrar el acceso con QR"
    });
  }
});
router.get("/points", async (_req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<any[]>("SELECT * FROM tbl_puntos_acceso");
    res.json(rows as Access[]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching access records" });
  }
});