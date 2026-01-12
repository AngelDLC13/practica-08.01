const request = require('supertest');
const express = require('express');
const fs = require('fs');

// Importa directamente el app desde index.js
const app = require('../index'); // Esto debería funcionar ahora

describe('API de usuarios', () => {
  const testUser = { id: 'test123', name: 'Test User', email: 'test@example.com' };

  // Limpiar antes de cada test
  beforeEach(() => {
    // Asegurarse de que el archivo existe
    if (!fs.existsSync('./users.json')) {
      fs.writeFileSync('./users.json', '[]', 'utf8');
    }
  });

  afterEach(() => {
    // Limpieza: eliminar usuario de prueba si existe
    if (fs.existsSync('./users.json')) {
      const users = JSON.parse(fs.readFileSync('./users.json', 'utf8'));
      const filtered = users.filter(u => u.id !== testUser.id);
      fs.writeFileSync('./users.json', JSON.stringify(filtered, null, 2), 'utf8');
    }
  });

  it('Debe responder el endpoint raiz', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Servidor en ejecucion/i);
  });

  it('Debe crear un nuevo usuario', async () => {
    const res = await request(app).post('/users').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toMatchObject(testUser);
  });

  it('Debe obtener todos los usuarios', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Debe buscar el usuario creado', async () => {
    // Primero crear el usuario
    await request(app).post('/users').send(testUser);
    
    // Luego buscarlo
    const res = await request(app).get(`/users/${testUser.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toMatchObject(testUser);
  });
});