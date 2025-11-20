# 🎨 Guía de Colores - AgroIA

## 📍 Ubicación de los Colores

Los colores de la aplicación están definidos en **2 lugares principales**:

---

## 1. 🎯 **Archivo Principal de Tema** (RECOMENDADO MODIFICAR AQUÍ)

### 📂 `frontend/src/styles/theme.ts`

Este es el archivo **principal** donde deberías modificar los colores. Todos los componentes deberían usar estos colores del tema.

```typescript
export const theme = {
  colors: {
    // Color de fondo principal (verde menta)
    mintBg: '#6EC1A9',
    
    // Color primario (verde oscuro)
    primary: '#2F6E62',
    primaryDark: '#23564D',
    
    // Colores de superficie
    surface: '#FFFFFF',
    background: '#71c3a8',
    
    // Colores de texto
    textOnMint: '#FFFFFF',
    textOnSurface: '#1F2A37',
    textSecondary: '#6B7280',
    
    // Colores adicionales
    muted: '#5B7A72',
    accentOrange: '#F19B18',
    border: '#E5E7EB',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
}
```

### 🌐 **Color de Fondo Global**

También en `theme.ts`, en `GlobalStyles`:

```typescript
body {
  background: #70C2B8;  // ← Color de fondo de toda la página
  color: white;
}
```

---

## 2. ⚠️ **Colores Hardcodeados en Componentes**

Algunos componentes tienen colores directamente escritos. Estos deberían migrarse al tema:

### **Colores encontrados en componentes:**

- `#70C2B8` - Verde menta (fondo de páginas)
- `#2F6E62` - Verde primario oscuro
- `#3F8C82` - Verde para avatares
- `#10B981` - Verde éxito
- `#0b3b33` - Verde muy oscuro (texto)
- `#6b7280` - Gris secundario
- `#5B7A72` - Gris muted
- `#e5e7eb` - Gris para bordes
- `#F19B18` - Naranja de acento
- `#b91c1c` - Rojo error
- `#fee2e2` - Rojo claro (fondo error)
- `#fecaca` - Rojo claro (borde error)

### **Archivos con colores hardcodeados:**

1. `frontend/src/pages/Login.tsx`
2. `frontend/src/pages/Register.tsx`
3. `frontend/src/pages/Dashboard.tsx`
4. `frontend/src/pages/ScanPage.tsx`
5. `frontend/src/components/HistoryModal.tsx`
6. `frontend/src/components/HistoryDetailModal.tsx`
7. `frontend/src/components/AnalysisModal.tsx`
8. `frontend/src/components/CustomerSupportModal.tsx`
9. `frontend/src/components/UserConfigModal.tsx`

---

## 🔧 **Cómo Modificar los Colores**

### **Opción 1: Modificar el Tema (RECOMENDADO)**

Edita `frontend/src/styles/theme.ts`:

```typescript
export const theme = {
  colors: {
    mintBg: '#TU_COLOR_AQUI',        // Fondo verde menta
    primary: '#TU_COLOR_AQUI',        // Color primario
    primaryDark: '#TU_COLOR_AQUI',    // Color primario oscuro
    // ... etc
  }
}
```

Y también el fondo global:

```typescript
body {
  background: #TU_COLOR_AQUI;  // Fondo de toda la página
}
```

### **Opción 2: Buscar y Reemplazar Colores Específicos**

Si quieres cambiar un color específico en todos los componentes:

1. Busca el color (ej: `#70C2B8`)
2. Reemplázalo por tu nuevo color

---

## 📋 **Paleta de Colores Actual**

| Color | Código | Uso |
|-------|--------|-----|
| **Verde Menta** | `#70C2B8` | Fondo principal de páginas |
| **Verde Primario** | `#2F6E62` | Botones, enlaces, elementos principales |
| **Verde Primario Oscuro** | `#23564D` | Hover de botones primarios |
| **Verde Avatar** | `#3F8C82` | Avatares de usuario |
| **Verde Éxito** | `#10B981` | Mensajes de éxito, elementos positivos |
| **Verde Menta Claro** | `#6EC1A9` | Fondo alternativo |
| **Naranja Acento** | `#F19B18` | Botones secundarios, acentos |
| **Gris Muted** | `#5B7A72` | Texto secundario |
| **Gris Borde** | `#E5E7EB` | Bordes de inputs, separadores |
| **Rojo Error** | `#EF4444` | Mensajes de error |
| **Blanco** | `#FFFFFF` | Superficies, fondos de cards |

---

## ✅ **Recomendación**

Para cambiar los colores de manera consistente:

1. **Modifica primero** `frontend/src/styles/theme.ts`
2. **Actualiza** el color de fondo global en `GlobalStyles`
3. **Busca y reemplaza** los colores hardcodeados en componentes para usar el tema

¿Quieres que te ayude a migrar los colores hardcodeados al tema centralizado?

