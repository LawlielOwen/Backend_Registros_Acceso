import { Router, Request, Response, NextFunction } from "express";
import pool from "../config/db";

const router = Router();


function generarToken(usuario: any) {
  const data = {
    id: usuario.id_usuario,
    rol: usuario.rol,
    fecha: new Date().getTime()
  };

  const texto = JSON.stringify(data);
  return Buffer.from(texto).toString('base64');
}


function validarToken(token: string) {
  try {
    const texto = Buffer.from(token, 'base64').toString('utf-8');
    const data = JSON.parse(texto);

    const ahora = new Date().getTime();

    if (ahora - data.fecha > 2 * 60 * 60 * 1000) {
      return null;
    }

    return data;

  } catch (error) {
    return null;
  }
}


function authMiddleware(req: Request, res: Response, next: NextFunction) {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Sin token" });
  }

  const token = authHeader.split(" ")[1];

  const data = validarToken(token);

  if (!data) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  (req as any).usuario = data;

  next();
}


router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const [rows]: any = await pool.query(
      "SELECT * FROM tbl_usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    if (user.password_hash !== password) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    if (user.estatus_cuenta !== "activo") {
      return res.status(403).json({ message: "Cuenta no activa" });
    }

    const token = generarToken(user);

    res.json({
      message: "Login exitoso",
      token,
      usuario: {
        id: user.id_usuario,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en login" });
  }
});


router.get("/protegida", authMiddleware, (req: Request, res: Response) => {

  const usuario = (req as any).usuario;

  res.json({
    message: "Acceso permitido",
    usuario
  });
});

export default router;