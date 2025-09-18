# n8n-nodes-google-maps-scraper

Este es un nodo de comunidad para n8n que permite interactuar con la API de Google Maps Scraper.

[n8n](https://n8n.io/) es una herramienta de automatización de flujos de trabajo de código abierto y extensible.

## Instalación

Sigue las [guías de instalación](https://docs.n8n.io/integrations/community-nodes/installation/) en la documentación oficial de n8n para instalar nodos de comunidad.

1. Ve a **Configuración > Nodos de Comunidad**
2. Selecciona **Instalar**
3. Ingresa `n8n-nodes-google-maps-scraper` como nombre del paquete
4. Acepta los riesgos de instalar un nodo de comunidad no verificado
5. Selecciona **Instalar**

Después de la instalación, el nodo **Google Maps Scraper** estará disponible en tu paleta de nodos.

## Configuración

### Credenciales

El nodo requiere credenciales de **Google Maps Scraper API**:

1. **Base URL**: La URL base de tu API de Google Maps Scraper (por defecto: `http://localhost:8080`)

### Operaciones Disponibles

#### Crear Job
Crea una nueva tarea de scraping con los siguientes parámetros:
- **Nombre del Job**: Nombre descriptivo para la tarea
- **Keywords**: Lista de palabras clave para buscar
- **Idioma**: Código de idioma para los resultados (ej: 'es', 'en')
- **Nivel de Zoom**: Nivel de zoom del mapa (1-20)
- **Latitud/Longitud**: Coordenadas del centro de búsqueda
- **Modo Rápido**: Activar modo de scraping rápido
- **Radio**: Radio de búsqueda en kilómetros
- **Profundidad**: Nivel de profundidad de búsqueda
- **Incluir Email**: Si incluir direcciones de email
- **Tiempo Máximo**: Tiempo máximo de ejecución en segundos
- **Proxies**: Lista de servidores proxy a utilizar

#### Obtener Todos los Jobs
Recupera una lista de todos los jobs de scraping.

#### Obtener Job
Obtiene información detallada de un job específico usando su ID.

#### Eliminar Job
Elimina un job específico usando su ID.

#### Descargar Resultados
Descarga los resultados de un job como archivo CSV.

## Ejemplo de Uso

### Crear un Job de Scraping

```json
{
  "name": "Cafeterías en Madrid",
  "keywords": ["cafetería madrid", "coffee shop madrid"],
  "lang": "es",
  "zoom": 15,
  "lat": "40.4168",
  "lon": "-3.7038",
  "radius": 10,
  "depth": 1,
  "email": true,
  "max_time": 3600
}
```

### Flujo de Trabajo Típico

1. **Crear Job** → Crear una nueva tarea de scraping
2. **Obtener Job** → Monitorear el estado del job
3. **Descargar Resultados** → Obtener los datos cuando el job esté completo

## Compatibilidad

- n8n v0.187.0 o superior
- Node.js 18.10 o superior

## Recursos

- [Documentación de n8n](https://docs.n8n.io/)
- [Nodos de Comunidad](https://docs.n8n.io/integrations/community-nodes/)

## Licencia

[MIT](https://github.com/your-username/n8n-nodes-google-maps-scraper/blob/main/LICENSE.md)

## Soporte

Para reportar problemas o solicitar funcionalidades, por favor crea un issue en el [repositorio de GitHub](https://github.com/your-username/n8n-nodes-google-maps-scraper/issues).
