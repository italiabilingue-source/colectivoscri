# **App Name**: School Shuttle Tracker

## Core Features:

- Firebase Authentication: Autenticación segura de usuarios mediante Firebase Authentication (correo electrónico + contraseña).
- Itinerary Management: Panel para agregar, editar y eliminar itinerarios con origen, destino, hora, día y notas opcionales.
- Real-time Updates: Mostrar actualizaciones de itinerarios en tiempo real utilizando el listener onSnapshot() de Firestore.
- Airport-style Display: Presentación visual similar a una pantalla de aeropuerto, con letras animadas para destino, hora, día y hora de salida. Herramienta LLM para realizar cambios estilísticos en el estado ('A tiempo', 'Retrasado', etc.).
- School/Farm Division: División clara en columnas de movimientos de 'Escuela' y 'Granja' con un separador central.
- Responsive Design: Diseño adaptable para pantallas grandes (modo TV) para garantizar una visualización óptima en diversos entornos.
- Firestore Integration: Almacenar y recuperar datos de itinerario utilizando Firestore con campos para origen, destino, hora, día, notas y estado activo.

## Style Guidelines:

- Color primario: Azul oscuro (#1A237E) para una sensación de calma y profesionalidad.
- Color de fondo: Azul muy oscuro (#0A0F29) para un tema oscuro y moderno adecuado para una pantalla pública.
- Color de acento: Azul eléctrico (#7DF9FF) para resaltar información y acciones importantes, al estilo de una pantalla de aeropuerto.
- Fuente del cuerpo y del título: 'Space Grotesk', una fuente sans-serif proporcional, que le da a la interfaz de usuario una sensación tecnológica apropiada para la pantalla simulada.
- Iconos simples y claros para representar el origen y el destino (por ejemplo, edificio escolar, granja).
- Diseño de dos columnas para movimientos de 'Escuela' y 'Granja', imitando las pantallas de los aeropuertos.
- Animaciones sutiles para las transiciones de letras, para dar un estilo de visualización digital suave.