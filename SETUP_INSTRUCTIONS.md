# 🐍 Snake Game App - Instrucciones de Configuración

## 📋 Requisitos Previos
- Node.js 18+ instalado
- Cuenta en Supabase
- Cuenta en Vercel (opcional, para deploy)

## 🚀 Pasos de Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Configurar Base de Datos Supabase

#### 2.1 Crear Proyecto en Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Anota tu `Project URL` y `anon public key`

#### 2.2 Configurar Variables de Entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui

# Database URL for Prisma (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres"

# Prisma Configuration
PRISMA_GENERATE_DATAPROXY=true
```

**Nota:** Reemplaza `[TU-PASSWORD]` con la contraseña de tu base de datos y `[TU-PROJECT-REF]` con la referencia de tu proyecto.

#### 2.3 Obtener DATABASE_URL desde Supabase
1. En tu proyecto de Supabase, ve a **Settings** > **Database**
2. Copia la **Connection string** de **URI**
3. Reemplaza `[YOUR-PASSWORD]` con tu contraseña real

### 3. Configurar Prisma

#### 3.1 Generar Cliente de Prisma
```bash
npx prisma generate
```

#### 3.2 Ejecutar Migraciones
```bash
npx prisma db push
```

**Nota:** Si prefieres usar migraciones tradicionales:
```bash
npx prisma migrate dev --name init
```

### 4. Ejecutar la Aplicación

#### 4.1 Modo Desarrollo
```bash
npm run dev
```

#### 4.2 Construir para Producción
```bash
npm run build
npm start
```

## 🌐 Deploy en Vercel

### 1. Conectar con GitHub
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en Vercel

### 2. Variables de Entorno en Vercel
Agrega las mismas variables de `.env.local` en la configuración de Vercel:
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎮 Cómo Jugar

1. **Formulario de Inicio**: Ingresa tu nombre, correo y selecciona un avatar
2. **Juego**: Usa las flechas del teclado para mover la serpiente
3. **Pausa**: Presiona la barra espaciadora para pausar
4. **Objetivo**: Come la comida (punto rojo) para crecer y ganar puntos
5. **Game Over**: Cuando choques con las paredes o contigo mismo
6. **Puntajes**: Tu puntuación se guarda automáticamente
7. **Leaderboard**: Ve los mejores puntajes de todos los jugadores

## 🛠️ Estructura del Proyecto

```
src/
├── app/
│   ├── api/scores/route.ts    # API para puntajes
│   ├── globals.css            # Estilos globales
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página principal
├── components/
│   ├── UserForm.tsx           # Formulario de usuario
│   ├── SnakeGame.tsx          # Juego Snake
│   └── Leaderboard.tsx        # Tabla de puntajes
└── lib/
    ├── prisma.ts              # Cliente de Prisma
    └── supabase.ts            # Cliente de Supabase
```

## 🔧 Solución de Problemas

### Error de Conexión a Base de Datos
- Verifica que `DATABASE_URL` sea correcta
- Asegúrate de que la base de datos esté activa en Supabase
- Verifica que las credenciales sean correctas

### Error de Prisma
- Ejecuta `npx prisma generate` después de cambios en el schema
- Verifica que el schema esté sincronizado con la base de datos

### Error de CORS
- Verifica la configuración de Supabase
- Asegúrate de que las políticas de seguridad estén configuradas

## 📱 Características

- ✅ Formulario de usuario con validación
- ✅ Selección de avatar
- ✅ Juego Snake completamente funcional
- ✅ Sistema de puntuación
- ✅ Guardado automático en base de datos
- ✅ Leaderboard en tiempo real
- ✅ Diseño responsive con Tailwind CSS
- ✅ Soporte para modo oscuro
- ✅ Integración con Supabase y Prisma
- ✅ API REST para puntajes

## 🎯 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Múltiples niveles de dificultad
- [ ] Efectos de sonido
- [ ] Modo multijugador
- [ ] Logros y badges
- [ ] Estadísticas del jugador
- [ ] Modo torneo

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa los logs de la consola
2. Verifica la configuración de variables de entorno
3. Asegúrate de que todas las dependencias estén instaladas
4. Verifica la conectividad con Supabase

¡Disfruta jugando Snake! 🐍🎮
