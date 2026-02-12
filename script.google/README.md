# Versión para Google Apps Script (`script.google.com`)

Esta carpeta contiene una versión completa del flujo `/rate` adaptada para ejecutarse como **Web App de Google Apps Script**.

## Archivos

- `Code.gs`: backend Apps Script (`doGet`, validación y guardado).
- `Index.html`: interfaz HTML/CSS/JS del formulario de calificación.
- `appsscript.json`: manifiesto del proyecto.

## Cómo usarlo en script.google.com

1. Crea un proyecto en [https://script.google.com](https://script.google.com).
2. Copia el contenido de `Code.gs` en el archivo `Code.gs` del proyecto.
3. Crea un archivo HTML llamado `Index` y pega el contenido de `Index.html`.
4. En **Project Settings**, activa "Show appsscript.json" y reemplaza su contenido con `appsscript.json`.
5. Publica como **Deploy > New deployment > Web app**.
   - Execute as: tu cuenta.
   - Who has access: según tu necesidad (por ejemplo, Anyone).
6. (Opcional) Agrega `?code=ABC123` en la URL para precargar el código de cliente.

## Dónde se guardan las calificaciones

Las respuestas se guardan en la hoja activa del proyecto en una pestaña llamada `Ratings` con columnas:

- `createdAt`
- `customerCode`
- `rating`

Si la pestaña no existe, se crea automáticamente con encabezados.
