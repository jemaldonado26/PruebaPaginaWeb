INSTRUCCIONES RÁPIDAS

Estructura del sitio:
- index.html
- about.html
- projects.html
- gallery.html
- team.html
- contact.html
- css/style.css
- js/scripts.js
- js/lang.json (traducciones)
- js/config.json (configuración del formulario y email)
- images/ (aquí sube tus imágenes)
- videos/ (aquí sube tus videos)

PARA CONFIGURAR:
1) Formulario: abre js/config.json y cambia "formEndpoint" por tu endpoint (Formspree u otro). 
   - Ej: "https://formspree.io/f/abcd1234"
2) Correo corporativo que aparece en Contacto: cambia "corporateEmail" en js/config.json
3) Idiomas: en js/config.json puedes activar/desactivar idiomas (enabledLangs) y cambiar defaultLang.
4) Agregar imágenes: pon archivos en /images y reemplaza los nombres en HTML si es necesario.
5) Videos: sube archivos .mp4 a /videos y edita gallery.html para añadir etiquetas <video> adecuadas.

MULTILINGÜE:
- Las frases están en js/lang.json. Añade o edita claves allí.
- Los elementos que usan traducción tienen el atributo data-i18n="clave"

Si necesitas que lo suba directamente a GitHub o que haga cambios, dímelo y lo hago.
