const request = require('supertest');
const app = require('../app');

describe('API de Canciones', () => {
    let cancionId;
    
    test('Debería crear una nueva canción', async () => {
        const res = await request(app)
        .post('/canciones')
        .send({ titulo: 'Canción de prueba', artista: 'Artista de prueba' });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        cancionId = res.body.id;
    });
    
    test('Debería obtener todas las canciones', async () => {
        const res = await request(app).get('/canciones');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
    
    test('Debería obtener una canción por su ID', async () => {
        const res = await request(app).get(`/canciones/${cancionId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('titulo', 'Canción de prueba');
        expect(res.body).toHaveProperty('artista', 'Artista de prueba');
    });
    
    test('Debería actualizar una canción existente', async () => {
        // Enviar una solicitud para actualizar la canción
        const res = await request(app)
        .put(`/canciones/${cancionId}`)
        .send({ titulo: 'Canción actualizada', artista: 'Artista actualizado' });
        // Verificar que la canción fue actualizada
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('titulo', 'Canción actualizada');
        expect(res.body).toHaveProperty('artista', 'Artista actualizado');
    });
    
    test('Debería eliminar una canción', async () => {
        // Enviar una solicitud para eliminar la canción
        const res = await request(app).delete(`/canciones/${cancionId}`);
        // Verificar que la canción fue eliminada
        expect(res.statusCode).toEqual(204);
    });
    test('Debería devolver un error al crear una canción sin datos completos', async () => {
        const res = await request(app)
            .post('/canciones')
            .send({ titulo: 'Canción incompleta' }); // No se proporciona el artista
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBeDefined();
    });
    test('Debería devolver un error al intentar actualizar una canción inexistente', async () => {
        const res = await request(app)
            .put('/canciones/9999') // ID de canción que no existe
            .send({ titulo: 'Canción actualizada', artista: 'Artista actualizado' });
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBeDefined();
    });
    test('Debería devolver un error al intentar eliminar una canción inexistente', async () => {
        const res = await request(app).delete('/canciones/9999'); // ID de canción que no existe
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toBeDefined();
    });
    test('Debería devolver una lista vacía al intentar obtener todas las canciones cuando no hay ninguna', async () => {
        const res = await request(app).get('/canciones');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
    test('Debería crear una nueva canción con ID automático', async () => {
        const nuevaCancion = { titulo: 'Nueva Canción', artista: 'Nuevo Artista' };
    
        const res = await request(app)
            .post('/canciones')
            .send(nuevaCancion);
    
        // Verifica que la API responda correctamente con un estado 201 (creado)
        expect(res.statusCode).toEqual(201);
    
        // Verifica que la respuesta contenga el objeto de la nueva canción con un ID generado automáticamente
        expect(res.body).toHaveProperty('id');
        expect(res.body.titulo).toEqual(nuevaCancion.titulo);
        expect(res.body.artista).toEqual(nuevaCancion.artista);
    });
});
