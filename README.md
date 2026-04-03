# 🚀 Tap2Go — Backend

API REST construida con **Node.js**, **Express** y **TypeScript**, conectada a una base de datos **MySQL**.

---

## 📁 Estructura del proyecto

```
Backend/
├── config/
│   └── db.ts               # Configuración del pool de conexión a MySQL
├── db/
│   └── stored_procedures/  # Procedimientos almacenados (SQL)
├── models/
│   └── example.ts          # Interfaces / modelos de TypeScript
├── routes/
│   ├── health.ts           # Ruta de salud del servidor
│   └── example.ts          # Rutas CRUD de ejemplo (Person)
├── server.ts               # Punto de entrada principal
├── tsconfig.json           # Configuración de TypeScript
├── package.json
└── .env                    # Variables de entorno (no subir al repo)
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto `/Backend` con las siguientes variables:

```
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_tu_base_de_datos
```

> ⚠️ Nunca subas el archivo `.env` al repositorio. Está incluido en el `.gitignore`.

---

## 📦 Instalación de dependencias

Desde la carpeta `/Backend`, ejecuta:

```bash
npm install
```

Esto instalará tanto las dependencias de producción como las de desarrollo (TypeScript, ts-node, nodemon, tipos, etc.).

---

## ▶️ Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor se iniciará con **nodemon** y **ts-node**, lo que significa que se reiniciará automáticamente cada vez que hagas un cambio en el código.

Por defecto estará disponible en:

```
http://localhost:3001
```

---

## 🛠️ Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con recarga automática |
| `npm start` | Inicia el servidor en modo producción |

---

## 🔍 Ruta de salud

Verifica que el servidor esté corriendo correctamente:

```
GET http://localhost:3001/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "ts": "2024-01-01T00:00:00.000Z"
}
```

---

## 👤 Ejemplo de API — Person

El modelo `Person` está definido en `models/example.ts`:

```ts
export interface Person {
  id: number;
  name: string;
  age: number;
}
```

Asegúrate de tener la siguiente tabla en tu base de datos:

```sql
CREATE TABLE persons (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  age  INT NOT NULL
);
```

### Endpoints disponibles

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/persons` | Obtener todas las personas |
| `GET` | `/api/persons/:id` | Obtener una persona por ID |
| `POST` | `/api/persons` | Crear una nueva persona |
| `PUT` | `/api/persons/:id` | Actualizar una persona existente |
| `DELETE` | `/api/persons/:id` | Eliminar una persona |

---

### 📋 Ejemplos de uso

#### Obtener todas las personas
```
GET http://localhost:3001/api/persons
```

#### Obtener una persona por ID
```
GET http://localhost:3001/api/persons/1
```

#### Crear una persona
```
POST http://localhost:3001/api/persons
Content-Type: application/json

{
  "name": "Juan Pérez",
  "age": 25
}
```

Respuesta:
```json
{
  "id": 1,
  "name": "Juan Pérez",
  "age": 25
}
```

#### Actualizar una persona
```
PUT http://localhost:3001/api/persons/1
Content-Type: application/json

{
  "name": "Juan Pérez",
  "age": 26
}
```

#### Eliminar una persona
```
DELETE http://localhost:3001/api/persons/1
```

Respuesta:
```json
{
  "message": "Person 1 deleted successfully"
}
```

---

## 🗂️ Cómo agregar nuevas rutas

1. Crea tu interfaz/modelo en `models/tu_modelo.ts`.
2. Crea tu archivo de rutas en `routes/tu_ruta.ts`.
3. Registra la ruta en `server.ts`:

```ts
import tuRouter from "./routes/tu_ruta";
app.use("/api/tu_ruta", tuRouter);
```

---

## 🧰 Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [mysql2](https://github.com/sidorares/node-mysql2)
- [dotenv](https://github.com/motdotla/dotenv)
- [ts-node](https://typestrong.org/ts-node/)
- [nodemon](https://nodemon.io/)