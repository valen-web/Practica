const express = require("express");
const app = express();
const cors = require("cors");
const cancionSchema = require("./canciones.js");

app.use(express.json());
app.use(cors());

let canciones = []; // Array para almacenar las canciones

app.get("/canciones", (req, res) => {
  //enviar un array vacio en caso de que no se encuentre ninguna cancion
  if (canciones.length === 0) {
    res.status(200).json([]);
  } else {
    res.json(canciones);
  }
});

// Ruta para obtener una canción por su ID
app.get("/canciones/:id", (req, res) => {
  const id = parseInt(req.params.id); // Convertir el ID de la URL a un número
  const cancion = canciones.find((c) => c.id === id); //buscar el ID de la cancion
  if (cancion) {
    res.status(200).json(cancion);
  } else {
    res.status(404).json(error.erros);
  }
});

// Ruta para crear una nueva canción
app.post("/canciones", (req, res) => {
  //verificar el esquema zod de la cancion
  cancionSchema.safeParse(req.body);
  // Obtener datos de la nueva canción
  const nuevaCancion = { ...req.body };
  // Verificar si los datos de la nueva canción están completos
  if (!nuevaCancion.titulo || !nuevaCancion.artista) {
    // Si los datos están incompletos, enviar un error 400 (Bad Request)
    return res
      .status(400)
      .json({ error: "Los datos de la canción están incompletos" });
  }
  //le creamos u id a la cancion
  nuevaCancion.id = parseInt(Math.random() * 10);
  canciones.push(nuevaCancion);
  res.status(201).json(nuevaCancion);
});

// Ruta para actualizar una canción existente
app.put("/canciones/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const cancionIndex = canciones.findIndex((c) => c.id === id);
  //si no se encontro la cancion responder con el estado 404, si si se encontro actualizar la cancion
  if (cancionIndex === -1) {
    res.status(404).json({ error: "la cancion no existe" });
  }
  canciones[cancionIndex] = { ...canciones[cancionIndex], ...req.body };
  res.status(200).json(canciones[cancionIndex]);
});

// Ruta para mostrat un error al intentar eliminar una cancion inexistente
app.delete("/canciones/9999", (req, res) => {
  // Obtenemos el ID de la canción de los parámetros de la solicitud
  const id = req.params.id;
  // Buscamos la canción con el ID especificado
  const cancionIndex = canciones.findIndex((c) => c.id === id);

  //verificamos si se encontro la cancion
  if (cancionIndex !== -1) {
    // Si se encontró la canción, la eliminamos del array de canciones
    canciones.splice(cancionIndex, 1);
    // Enviamos una respuesta con un estado 204 (Sin contenido)
    res.sendStatus(204);
  } else {
    // Si no se encontró la canción, enviamos un estado 404 (No encontrado)
    res.status(404).json({ error: "La canción no existe" });
  }
});

//ruta para eliminar una cancion
app.delete("/canciones/:id", (req, res) => {
  // Obtenemos el ID de la canción de los parámetros de la solicitud
  const id = req.params.id;
  // Buscamos la canción con el ID especificado
  const cancionIndex = canciones.findIndex((c) => c.id === id);
  // Si se encontró la canción, la eliminamos del array de canciones
  canciones.splice(cancionIndex, 1);
  // Enviamos una respuesta con un estado 204 (Sin contenido)
  res.sendStatus(204);
});

app.listen("3000", () => {
  console.log("escuchando el puerto 3000");
});

module.exports = app;
