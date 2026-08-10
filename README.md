# 🚀 Portafolio Personal — Emerson Corredor Murcia

Portafolio web profesional construido con **HTML5**, **CSS3** y **JavaScript** puro.

---

## 📁 Estructura del proyecto

```
Portafolio/
├── index.html              ← Página principal
├── css/
│   └── style.css           ← Estilos principales
├── js/
│   └── script.js           ← JavaScript interactivo
├── images/
│   ├── profile/
│   │   ├── profile.jpg     ← TU FOTO DE PERFIL (500x500px recomendado)
│   │   ├── cv.pdf          ← TU CV EN PDF
│   │   └── og-image.jpg    ← Imagen para Open Graph (1200x630px)
│   ├── projects/
│   │   ├── stayhuila.jpg   ← Imagen proyecto StayHuila
│   │   ├── ocr-farmacia.jpg← Imagen proyecto OCR Farmacia
│   │   └── proyecto-3.jpg  ← Imagen tercer proyecto
│   └── logos/
│       └── favicon.svg     ← Favicon (generado automáticamente por JS)
└── README.md
```

---

## ✏️ Guía de personalización

### 1. Tu foto de perfil
Coloca tu foto en `images/profile/profile.jpg` (500×500 px mínimo, preferiblemente cuadrada).

Luego en `index.html`, busca el comentario `<!-- Cuando tengas tu foto -->` en la sección "Sobre mí" y reemplaza el `div.about__photo-placeholder` por:
```html
<img src="images/profile/profile.jpg" alt="Emerson Corredor Murcia" class="about__photo" loading="lazy" />
```

### 2. Tu CV
Coloca tu CV en `images/profile/cv.pdf`. El botón "Descargar CV" ya apunta a esa ruta.

### 3. URLs de proyectos
Busca en `index.html` los siguientes textos y reemplázalos:

| Placeholder | Qué poner |
|---|---|
| `https://TU_URL_STAYHUILA.com` | URL real de StayHuila |
| `https://github.com/TU_USUARIO/stayhuila` | GitHub de StayHuila |
| `https://TU_URL_OCR_FARMACIA.com` | URL real del sistema OCR |
| `https://github.com/TU_USUARIO/ocr-farmacia` | GitHub del OCR |
| `https://TU_URL_PROYECTO_3.com` | URL real del tercer proyecto |
| `https://github.com/TU_USUARIO/proyecto-3` | GitHub del tercer proyecto |

### 4. Imágenes de proyectos
Coloca las imágenes en `images/projects/` con los nombres correspondientes.
Luego en cada tarjeta de proyecto, busca el comentario y reemplaza el placeholder por un `<img>`.

### 5. Datos de contacto
Busca y reemplaza en `index.html` Y `js/script.js`:

| Placeholder | Qué poner |
|---|---|
| `TU_CORREO@gmail.com` | Tu correo real |
| `TU_USUARIO_GITHUB` | Tu usuario de GitHub |
| `TU_PERFIL_LINKEDIN` | Tu perfil de LinkedIn (sin la URL base) |
| `TU_NUMERO` | Tu número de WhatsApp con código de país (ej: `573001234567`) |

### 6. Nombre del tercer proyecto
En la tarjeta del Proyecto 3, reemplaza:
- `Tu Proyecto` → Nombre real
- El texto de descripción
- Las tecnologías usadas

---

## 📧 Activar el formulario de contacto

El formulario está listo en el frontend pero necesita un backend para enviar mensajes.

**Opción más fácil — Formspree:**
1. Ve a [formspree.io](https://formspree.io) y crea una cuenta
2. Crea un nuevo formulario y copia el ID
3. En `index.html` agrega el atributo `action` al `<form>`:
   ```html
   <form ... action="https://formspree.io/f/TU_ID_FORMSPREE" method="POST">
   ```
4. En `js/script.js`, reemplaza la simulación con el fetch real (ver comentario en el código)

---

## 🌐 Publicar en internet

### GitHub Pages (Gratis)
1. Sube el proyecto a GitHub
2. Ve a Settings → Pages → Source: main branch → /root
3. Tu sitio estará disponible en `https://TU_USUARIO.github.io/Portafolio`

### Netlify (Recomendado)
1. Ve a [netlify.com](https://netlify.com) → Login con GitHub
2. "New site from Git" → Selecciona tu repositorio
3. Build command: vacío | Publish directory: `/`
4. Deploy — Obtienes una URL gratuita en segundos

### Vercel
1. Ve a [vercel.com](https://vercel.com) → Login con GitHub
2. Importa el repositorio
3. Deploy automático

---

## 🎨 Personalizar colores

Todos los colores están como variables CSS en `css/style.css` al inicio del archivo.
Las más importantes:

```css
--color-primary:  #4f8ef7;   /* Azul principal */
--color-accent:   #00e5ff;   /* Cian de acento */
--color-bg:       #050a14;   /* Fondo oscuro */
```

Para cambiar el esquema de color, modifica estas tres variables y el resto se actualiza automáticamente.

---

## 🔧 Tecnologías usadas

- **HTML5** — Estructura semántica y accesible
- **CSS3** — Variables, Grid, Flexbox, animaciones, glassmorphism
- **JavaScript ES6+** — IntersectionObserver, Canvas API, módulos
- **Google Fonts** — Inter + JetBrains Mono
- **Devicons** — Iconos de tecnologías
- **Boxicons** — Iconos de interfaz

---

## 📱 Compatibilidad

✅ Chrome / Edge / Firefox / Safari  
✅ Android / iOS  
✅ Responsive: 320px → 2560px  
✅ Prefers-reduced-motion (accesibilidad)  

---

© 2026 Emerson Corredor Murcia. Todos los derechos reservados.
