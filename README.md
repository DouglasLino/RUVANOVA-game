# RUVANOVA

RUVANOVA es un videojuego web 2D de disparos y supervivencia espacial, desarrollado con apoyo de IA como parte de una actividad de vibecoding y prompt engineering. El jugador controla una nave, destruye enemigos y acumula puntos mientras intenta sobrevivir con tres vidas.

El objetivo del proyecto es crear un juego sencillo y atractivo, trabajando por etapas con instrucciones claras para la IA y revisando los resultados antes de continuar.

## Tecnologias utilizadas

- **JavaScript y Phaser 3:** logica, escenas, movimiento, colisiones y efectos del juego.
- **HTML5 y CSS3:** presentacion de la pagina y diseño adaptable.
- **Vite y npm:** instalacion, ejecucion local y compilacion.
- **localStorage:** almacenamiento del record en el navegador.
- **GitHub Actions y GitHub Pages:** configuracion para compilar y publicar el sitio.

## Instalacion y ejecucion

Necesitas Node.js 22 y npm. Desde la carpeta del proyecto, ejecuta:

```bash
npm install
npm run dev
```

Abre la direccion indicada por Vite, normalmente `http://localhost:5173/RUVANOVA-game/`. El juego necesita teclado; haz clic en su area para activar los controles.

Para compilar y revisar la version de produccion:

```bash
npm run build
npm run preview
```

La compilacion queda en `dist/`. Abre la direccion indicada por preview con la ruta `/RUVANOVA-game/`, en lugar de abrir el archivo HTML directamente.

**Enlace publico:** 
https://douglaslino.github.io/RUVANOVA-game/

## Funcionalidades principales

El juego incluye menu, enemigos automaticos, colisiones, puntuacion, tres vidas, dificultad progresiva, pausa, Game Over, reinicio y record local.

Las mejoras avanzadas son:

- **Power-Ups:** disparo triple, escudo temporal, disparo rapido y recuperacion de vida.
- **Nova Blast:** habilidad que se carga al eliminar enemigos y permite limpiar proyectiles y dañar enemigos cercanos.
- **Jefes finales:** enemigos con barra de vida y ataques especiales que se vuelven mas dificiles.
- **Combos:** multiplicadores de puntos por encadenar eliminaciones.
- **Efectos cinematograficos:** estrellas en distintas capas, particulas, destellos, vibracion y camara lenta al derrotar jefes.

La misma pagina presenta las mecanicas y una guia de controles debajo del juego, reutilizando sus graficos.

| Control | Accion |
| --- | --- |
| WASD o flechas | Mover la nave. |
| Espacio | Disparar; se puede mantener pulsado. |
| Q | Activar Nova Blast con la energia llena. |
| P | Pausar o reanudar. |
| Enter | Iniciar desde el menu o reiniciar desde Game Over. |
| Tab | Salir del area del juego y continuar por la pagina. |

Al salir del foco del juego, la partida se pausa. Para continuar, vuelve a su area y pulsa P.

## Prompts utilizados y ajustes

Estos son extractos de tres prompts reales utilizados durante el desarrollo.

### 1. Añadir mecanicas avanzadas

> Quiero implementar las cinco nuevas funcionalidades avanzadas de RUVANOVA, definidas en la seccion 11 del archivo `AGENTS.md`.

Se solicito incorporar las mejoras una por una, conservar las mecanicas existentes y compilar despues de cada paso. La ampliacion buscaba enriquecer la partida; dividirla en etapas permitio revisar cada cambio antes de continuar.

### 2. Corregir Game Over

> Corrige un error de RUVANOVA que ocurre cuando el jugador pierde todas sus vidas.

El prompt incluyo el mensaje de error de consola y pidio corregir su causa respetando el ciclo de vida de Phaser. Este ajuste fue necesario porque la partida se congelaba al morir y no aparecia Game Over. Aportar el error concreto ayudo a centrar la revision.

### 3. Mejorar la presentacion

> Mantener una sola pagina web con el videojuego como elemento principal y agregar debajo una seccion moderna que explique todas las funcionalidades implementadas.

Se pidio explicar las mecanicas con recursos visuales, conservar el estilo y evitar nuevas librerias. La pagina se amplio para presentar mejor el proyecto, y se ajusto el foco del teclado para que el desplazamiento de la pagina no interfiriera con el juego.

Estos prompts combinaron contexto, tareas concretas y restricciones. Las siguientes solicitudes respondieron a necesidades detectadas durante el desarrollo, en lugar de intentar resolver todo con una sola instruccion.

## Iteraciones y mejoras

1. **Juego base:** menu, movimiento, disparos, enemigos, vidas, puntuacion y reinicio.
2. **Mecanicas avanzadas:** Power-Ups, Nova Blast, jefes, efectos y combos, implementados en ese orden.
3. **Correccion de estabilidad:** solucion del bloqueo de Game Over y revision del reinicio.
4. **Presentacion:** seccion informativa y controles visuales en la misma pagina.
5. **Documentacion:** explicacion del proyecto, los prompts y las validaciones para la entrega academica.

## Validacion y error de Game Over

Durante el desarrollo se ejecutaron compilaciones con `npm run build` despues de las mejoras. Tambien se reviso la sintaxis y se realizaron comprobaciones puntuales de puntuacion, habilidades, pausa y transiciones entre escenas. Las simulaciones de muerte y reinicio permitieron comprobar la restauracion de velocidad y la limpieza de eventos y temporizadores.

El error de Game Over mostraba `Cannot set properties of null (setting 'timeScale')`. Al cerrar la escena se intentaba restaurar la velocidad del mundo fisico cuando Phaser ya lo habia destruido. Se corrigio restaurando la velocidad antes de pausar la fisica al morir y retirando ese acceso del cierre de la escena. La nueva partida tambien comienza con velocidad normal.

La ultima compilacion del proyecto se realizo correctamente mediante `npm run build`, aunque se presento una advertencia relacionada con el tamaño del paquete JavaScript, sin afectar la compilacion.

Ademas, realice pruebas manuales desde el navegador para verificar el movimiento de la nave, disparos, colisiones, puntuacion y funcionamiento de las nuevas habilidades. Tambien revise el comportamiento de Game Over, el reinicio de partidas y el almacenamiento del record.

Durante estas pruebas se identifico y corrigio un error que impedia finalizar correctamente la partida. Despues de aplicar la solucion, se comprobo nuevamente el funcionamiento del juego.

Aunque el proyecto no cuenta con pruebas automatizadas, las validaciones manuales permitieron comprobar sus principales funcionalidades y detectar errores que no se identificaban durante la compilacion.

## Principales partes del codigo

| Archivo | Funcion |
| --- | --- |
| `index.html` y `src/style.css` | Estructura y aspecto de la pagina. |
| `src/main.js` | Inicio del juego y manejo del foco del teclado. |
| `src/scenes/MenuScene.js` | Menu principal. |
| `src/scenes/GameScene.js` | Partida, enemigos, habilidades, vidas y puntuacion. |
| `src/scenes/GameOverScene.js` | Resultados y opciones para volver a jugar. |
| `src/scenes/shared.js` | Graficos, botones, fondo y guardado del record. |

Las escenas separan las pantallas del juego: **Menu → Partida → Game Over → Reinicio o Menu**. `AGENTS.md` contiene las reglas para orientar el trabajo con IA.

## Reflexion final

El proyecto muestra que la IA puede ayudar a convertir una idea en cambios concretos y facilitar las mejoras por etapas. Los prompts con contexto, limites y criterios de revision hicieron mas claro el trabajo.

El error de Game Over tambien muestra una limitacion: una compilacion correcta no garantiza que todo funcione durante una partida. Es necesario revisar el codigo, comunicar los errores y comprobar las correcciones. El caso deja como aprendizaje la importancia de probar las transiciones y los reinicios, ademas de las funciones habituales.

Como temas por reforzar, el proyecto plantea el manejo de eventos y escenas en Phaser, la depuracion de errores y las pruebas en navegador.

## Reflexion personal:

Desarrollar RUVANOVA con ayuda de ChatGPT y Codex fue una experiencia interesante porque pude convertir una idea sencilla en un videojuego con varias funcionalidades. Al principio buscaba crear algo basico, pero conforme fui probando el resultado se me ocurrieron nuevas mejoras que pude solicitar mediante prompts.

Una de las principales ventajas que encontre fue la rapidez para desarrollar funcionalidades y realizar modificaciones sin tener que escribir todo el codigo desde cero. Sin embargo, tambien descubri que la IA puede introducir errores cuando modifica partes que ya funcionan. Esto sucedio con la pantalla de Game Over, que dejo de funcionar despues de agregar nuevas mecanicas. Para solucionarlo tuve que revisar la consola del navegador, identificar el error y proporcionar esa informacion a Codex.

Actualmente comprendo mejor como se organiza el videojuego mediante escenas, como se manejan los controles, la puntuacion y las colisiones. Todavia necesito reforzar aspectos como los eventos, temporizadores y el ciclo de vida de las escenas de Phaser.

Mi principal aprendizaje es que utilizar IA para programar no consiste solamente en pedirle que genere codigo. Tambien es necesario saber explicar lo que necesitamos, revisar los resultados y comprobar que cada cambio funcione correctamente.
