# ASINEA

Página web de ASINEA: café colombiano en grano, molido y empacado en bolsa.
Sitio estático (HTML, CSS y JavaScript sin dependencias ni paso de compilación).

## Estructura

```
index.html      Estructura de la página
css/style.css   Estilos
js/main.js      Animaciones, productos, carrito y pedido por WhatsApp
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub y sube el contenido de esta carpeta (que `index.html` quede en la raíz).
2. En el repositorio: **Settings > Pages**.
3. En **Build and deployment**, elige **Deploy from a branch**, rama `main`, carpeta `/ (root)`, y guarda.
4. En un par de minutos la página queda en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

También se puede abrir `index.html` directamente en el navegador para probarla.

## Qué editar

Todo está en `js/main.js`:

- **Cafés y precios:** arreglo `COFFEES` (nombre, origen, altura, notas, precio base `base` en COP y `stock`). Los datos actuales son de ejemplo.
- **Pesos y multiplicadores de precio:** arreglo `WEIGHTS`.
- **Número de WhatsApp de pedidos:** constante `WA_NUM` (formato `57` + número, sin signos). Hoy: `573044590274`.

En `index.html`, al final del pie de página, están los enlaces a Instagram, TikTok y WhatsApp (apuntan a las páginas generales) y los textos legales (placeholders).

## Cómo funciona el pedido

No hay servidor ni pasarela de pago. Al confirmar, la página guarda el pedido en el navegador del cliente y abre WhatsApp con el pedido escrito. El pago y el envío se coordinan por ahí. Para conectar una pasarela o una transportadora, el punto de entrada es la función `submitOrder` en `js/main.js`.

## Notas

- Las tipografías se cargan desde Google Fonts, por lo que se necesita conexión a internet.
- El sonido es opcional y arranca apagado.
- Respeta `prefers-reduced-motion`: con esa preferencia se omiten las animaciones largas.
