# RUVANOVA

Videojuego web 2D de supervivencia espacial con JavaScript, Phaser 3 y Vite. Sin backend, cuentas ni recursos graficos externos: Phaser dibuja las naves, las estrellas y los efectos.

## Instalacion y ejecucion

Necesitas Node.js 22 y npm.

```bash
npm install
npm run dev
```

Abre la direccion que muestra Vite, normalmente `http://localhost:5173/ruvanova/`. El juego necesita un teclado; haz clic en el area del juego para activar sus controles.

## Pagina y foco del teclado

El sitio conserva una sola pagina: primero el videojuego, despues las cinco mecanicas avanzadas y una guia visual de controles. La informacion se adapta a pantallas pequenas; el juego mantiene su resolucion interna de 1000 × 580 y necesita teclado.

Haz clic en el juego o enfocalo con Tab para usar sus controles. Mientras tiene el foco, espacio y flechas no desplazan la pagina. Pulsa Tab o haz clic fuera para continuar leyendo: la partida se pausa y se liberan las teclas. Para continuar, vuelve al juego y pulsa P.

Las ilustraciones de naves reutilizan las texturas generadas por Phaser despues del primer fotograma; los simbolos y diagramas se dibujan con HTML/CSS. No hay descargas de imagenes ni nuevas dependencias, y los recursos mantienen compatibilidad con `/ruvanova/`.

## Como jugar

Pulsa **Iniciar mision** o **Enter** en el menu. Destruye las naves enemigas y sobrevive el mayor tiempo posible.

| Control | Accion |
| --- | --- |
| WASD o flechas | Mover la nave en ocho direcciones |
| Barra espaciadora (mantener) | Disparar |
| Q | Activar Nova Blast con energia al 100% |
| P | Pausar o reanudar |
| Enter | Iniciar desde el menu o reiniciar en Game Over |

- Empiezas con tres vidas. Chocar con un enemigo o dejar que escape por el borde inferior cuesta una vida.
- Tras una colision tienes un breve periodo de invulnerabilidad, indicado por el parpadeo de la nave. Los enemigos que escapan siempre restan una vida.
- Cada enemigo destruido suma 100 puntos de base, afectados por el multiplicador de combo.
- Cada 15 segundos sube el nivel: los enemigos aparecen con mayor frecuencia y velocidad.
- Al perder las tres vidas se muestra Game Over, con opciones para reiniciar o volver al menu.
- El record se guarda al terminar la partida en `localStorage` del navegador. Si el almacenamiento esta bloqueado, puedes seguir jugando sin persistencia.
- Al cambiar de ventana, el juego se pausa automaticamente. Pulsa P para continuar.

## Mecanicas avanzadas

- **Power-Ups:** cada enemigo eliminado tiene un 22% de probabilidad de soltar una mejora. Recogela con la nave: **T** morado activa disparo triple, **E** cyan activa escudo y **R** amarillo activa disparo rapido. Duran 8 segundos; recoger el mismo tipo renueva su duracion y los distintos tipos se combinan. **+** verde recupera una vida, hasta un maximo de tres. El escudo bloquea impactos, pero los enemigos que escapan siguen restando vidas.
- **Nova Blast:** cada eliminacion carga 10% de energia. Con 100%, pulsa **Q** para consumirla y emitir una onda de radio 260: destruye los proyectiles enemigos en pantalla, elimina enemigos cercanos y causa 15 puntos de daño a los jefes dentro del radio. Las bajas de la onda tambien recargan energia.
- **Jefes:** aparecen al alcanzar cada umbral de 2000 puntos, uno a la vez. Tienen barra de vida, movimiento lateral y abanicos de proyectiles dirigidos hacia tu posicion. Cada jefe aumenta su resistencia y velocidad de ataque; alternan abanicos de tres y cinco disparos. Derrotarlos otorga 1000 puntos de base.
- **Efectos:** estrellas en tres planos de parallax, particulas de explosion, destellos al disparar e impactar, vibracion y destello al derrotar jefes, con un breve periodo de camara lenta.
- **Combos:** encadena bajas con menos de 3,5 segundos entre ellas. Cada cinco bajas aumenta el multiplicador, desde x1 hasta x5. Recibir daño o agotar el tiempo reinicia el combo. El HUD muestra bajas y multiplicador.
- La pausa congela las mejoras temporales, la energia, los combos y los ataques de los jefes. Al reiniciar se restablecen todos los estados de la partida.

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

Pruebas manuales de las mejoras: recoger los cuatro tipos de Power-Ups y comprobar duracion, combinacion y limite de vidas; activar Q con y sin carga y comprobar su alcance sobre enemigos y jefes; alcanzar varios umbrales de jefe, recibir sus proyectiles y derrotarlos; comprobar combos por bajas, daño y espera; pausar durante mejoras y ataques; revisar fluidez, camara lenta, Game Over, reinicio y persistencia del record.

Pruebas manuales de la pagina: revisar las cinco caracteristicas y los controles en escritorio y movil; comprobar que las naves se muestran despues de cargar; enfocar el juego, mantener espacio y flechas y verificar que la pagina no se desplaza; salir con Tab o un clic y comprobar la pausa, el scroll normal y la liberacion de teclas; volver al juego y reanudar con P. Repetir las transiciones menu, partida, Game Over y reinicio desde la pagina ampliada.
