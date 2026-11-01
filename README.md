# RUVANOVA

Videojuego web 2D de supervivencia espacial con JavaScript, Phaser 3 y Vite. Sin backend, cuentas ni recursos graficos externos: Phaser dibuja las naves, las estrellas y los efectos.

## Instalacion y ejecucion

Necesitas Node.js 22 y npm.

```bash
npm install
npm run dev
```

Abre la direccion que muestra Vite, normalmente `http://localhost:5173/ruvanova/`. El juego necesita un teclado; haz clic en el area del juego para activar sus controles.

## Como jugar

Pulsa **Iniciar mision** o **Enter** en el menu. Destruye las naves enemigas y sobrevive el mayor tiempo posible.

| Control | Accion |
| --- | --- |
| WASD o flechas | Mover la nave en ocho direcciones |
| Barra espaciadora (mantener) | Disparar |
| P | Pausar o reanudar |
| Enter | Iniciar desde el menu o reiniciar en Game Over |

- Empiezas con tres vidas. Chocar con un enemigo o dejar que escape por el borde inferior cuesta una vida.
- Tras una colision tienes un breve periodo de invulnerabilidad, indicado por el parpadeo de la nave. Los enemigos que escapan siempre restan una vida.
- Cada enemigo destruido suma 100 puntos.
- Cada 15 segundos sube el nivel: los enemigos aparecen con mayor frecuencia y velocidad.
- Al perder las tres vidas se muestra Game Over, con opciones para reiniciar o volver al menu.
- El record se guarda al terminar la partida en `localStorage` del navegador. Si el almacenamiento esta bloqueado, puedes seguir jugando sin persistencia.
- Al cambiar de ventana, el juego se pausa automaticamente. Pulsa P para continuar.

## Compilacion local

```bash
npm run build
npm run preview
```

La compilacion se genera en `dist/`. Abre la URL de preview con la ruta `/ruvanova/`. No abras `index.html` directamente desde el sistema de archivos.

## Despliegue en GitHub Pages

1. Sube el proyecto, incluido `package-lock.json`, a un repositorio de GitHub llamado `ruvanova`.
2. En **Settings → Pages → Build and deployment → Source**, selecciona **GitHub Actions**.
3. Sube los cambios a la rama `main`. El workflow `.github/workflows/deploy.yml` instala con `npm ci`, compila y publica `dist/`.
4. Consulta la ejecucion en **Actions** y abre la URL del entorno `github-pages` al finalizar.

Tambien puedes iniciar el workflow manualmente desde Actions. Utiliza los permisos integrados de GitHub Actions; no requiere tokens personales. La ruta base de Vite es `/ruvanova/`, por lo que el nombre del repositorio debe coincidir con esa ruta para el despliegue habitual en Pages.

## Estructura

```text
.github/workflows/deploy.yml  Compilacion y despliegue
public/assets/               Reservado para recursos locales
src/main.js                  Configuracion de Phaser
src/style.css                Interfaz de la pagina
src/scenes/MenuScene.js      Menu principal
src/scenes/GameScene.js      Partida, colisiones, HUD y pausa
src/scenes/GameOverScene.js   Resultados y reinicio
src/scenes/shared.js          Graficos, UI y almacenamiento compartidos
index.html                   Contenedor del juego
vite.config.js               Ruta base para GitHub Pages
```

## Validacion

`npm run build` comprueba la compilacion de produccion. El proyecto no incluye una suite automatizada de pruebas. Para comprobar la interaccion, inicia una partida, prueba movimiento y disparos, pulsa P dos veces, verifica la perdida de vidas por colision y fuga, espera el cambio de nivel y comprueba el reinicio y el record despues de recargar.
