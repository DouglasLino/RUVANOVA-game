
# RUVANOVA - Instrucciones del Proyecto

## 1. Descripcion general

RUVANOVA es un videojuego web 2D de tipo Space Shooter,
desarrollado con JavaScript, Phaser 3 y Vite.

El jugador controla una nave espacial, elimina enemigos,
acumula puntos e intenta sobrevivir el mayor tiempo posible.

Es un proyecto academico desarrollado con apoyo de IA,
por lo que debe mantenerse sencillo, funcional, organizado
y facil de comprender.

## 2. Stack tecnologico

Utilizar exclusivamente:

- JavaScript (ES Modules).
- Phaser 3 para el motor del videojuego.
- Vite para desarrollo y compilacion.
- HTML5 y CSS3.
- npm para gestionar dependencias.
- GitHub Actions para CI/CD.
- GitHub Pages para el despliegue.

No incorporar:

- TypeScript.
- React, Angular, Vue o Next.js.
- Backend o APIs externas.
- Bases de datos.
- Docker.
- Dependencias innecesarias.

## 3. Reglas de desarrollo

- Priorizar la simplicidad y mantenibilidad.
- Evitar la sobreingenieria.
- Respetar la estructura existente del proyecto.
- Utilizar nombres descriptivos para variables y funciones.
- Organizar la logica mediante escenas de Phaser.
- Crear funciones pequeñas y reutilizables.
- Evitar duplicacion innecesaria de codigo.
- Utilizar ES Modules (import/export).
- Preferir const sobre let cuando sea posible.
- No utilizar var.
- Mantener una estructura de carpetas sencilla.
- No agregar funcionalidades fuera del alcance solicitado.
- Escribir comentarios solo cuando aporten valor.
- Utilizar español sin tildes en comentarios tecnicos.
- No modificar archivos ajenos a la tarea solicitada.

## 4. Funcionalidades del videojuego

El videojuego debe incluir:

- Menu principal.
- Movimiento mediante WASD o flechas.
- Disparos utilizando la barra espaciadora.
- Generacion automatica de enemigos.
- Deteccion de colisiones.
- Sistema de puntuacion.
- Tres vidas por partida.
- Dificultad progresiva.
- Pausa y reanudacion con la tecla P.
- Pantalla de Game Over.
- Reinicio de partida.
- Mejor puntuacion almacenada en localStorage.

No implementar funcionalidades adicionales sin solicitarlas.

## 5. Diseño visual

- Estilo arcade espacial moderno.
- Fondo oscuro con estrellas.
- Colores principales: azul neon, morado y cyan.
- Nave del jugador claramente diferenciada.
- Enemigos visualmente identificables.
- Efectos sencillos de disparos y explosiones.
- Interfaz limpia y legible.
- Animaciones fluidas.

Priorizar graficos 2D sencillos utilizando Phaser.

Evitar recursos externos que compliquen la ejecucion.

## 6. Estructura del proyecto

Mantener una estructura similar a:

ruvanova/
- .github/workflows/deploy.yml
- public/assets/
- src/scenes/MenuScene.js
- src/scenes/GameScene.js
- src/scenes/GameOverScene.js
- src/main.js
- src/style.css
- index.html
- package.json
- vite.config.js
- README.md
- AGENTS.md

Crear archivos adicionales solo cuando sean necesarios.

## 7. Validaciones

Antes de finalizar cualquier cambio:

- Revisar los archivos modificados.
- Verificar que no existan errores de sintaxis.
- Ejecutar npm run build.
- Ejecutar pruebas existentes cuando corresponda.
- Validar que los cambios no afecten funcionalidades previas.
- No afirmar que una prueba fue exitosa sin ejecutarla.
- Informar cualquier error o limitacion encontrada.

## 8. Despliegue

El proyecto debe ser compatible con GitHub Pages.

- Mantener la ruta base de Vite en /ruvanova/.
- Utilizar GitHub Actions para desplegar desde main.
- Generar la compilacion en dist/.
- No introducir configuraciones de servidor.
- No utilizar credenciales ni tokens personales.
- Evitar modificar el workflow sin necesidad.

## 9. Documentacion

Mantener actualizado el README.md cuando existan
cambios relevantes en funcionalidades, instalacion
o despliegue.

Los comentarios tecnicos y la documentacion deben
escribirse en español, utilizando un lenguaje claro.

## 10. Comportamiento esperado de Codex

- Analizar el codigo existente antes de modificarlo.
- Respetar las convenciones del proyecto.
- Implementar solamente lo solicitado.
- Evitar refactorizaciones no relacionadas.
- No agregar nuevas dependencias sin justificacion.
- Priorizar soluciones simples y funcionales.
- Comprobar los cambios mediante las validaciones disponibles.
- Explicar brevemente los cambios realizados.
- Indicar los archivos modificados.
- Reportar los resultados de las validaciones.


## 11. Funcionalidades avanzadas

RUVANOVA debe incorporar las siguientes mecanicas
para mejorar la experiencia del jugador.

### Power-Ups
- Disparo triple.
- Escudo temporal.
- Disparo rapido.
- Recuperacion de vida.
- Aparicion aleatoria al destruir enemigos.

### Jefes finales
- Aparicion de jefes cada cierta puntuacion.
- Barra de vida visible.
- Patrones de ataque especiales.
- Dificultad progresiva.

### Nova Blast
- Habilidad especial exclusiva de RUVANOVA.
- Barra de energia que aumenta al eliminar enemigos.
- Activacion mediante la tecla Q.
- Onda expansiva que elimina proyectiles enemigos
  y causa daño a enemigos cercanos.

### Sistema de combos
- Multiplicadores de puntuacion por eliminaciones.
- Incremento del multiplicador segun las bajas.
- Reinicio del combo al recibir daño o pasar
  demasiado tiempo sin eliminar enemigos.

### Efectos cinematograficos
- Fondo espacial con efecto parallax.
- Particulas en explosiones.
- Vibracion ligera de pantalla.
- Destellos en disparos e impactos.
- Camara lenta al derrotar un jefe.

### Reglas de implementacion
- Mantener la arquitectura actual del proyecto.
- Reutilizar componentes y funciones existentes.
- No agregar dependencias innecesarias.
- Evitar afectar las funcionalidades actuales.
- Mantener un rendimiento fluido.
- Implementar las mejoras de manera incremental.
- Validar el funcionamiento despues de cada mejora.


Objetivo principal:

Mantener RUVANOVA como un videojuego 2D sencillo,
atractivo, funcional y facil de mantener.

