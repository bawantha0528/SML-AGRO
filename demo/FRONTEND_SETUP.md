# Frontend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Development Mode
Run React with Hot Module Reloading while developing:
```bash
npm run dev
```
Access at: `http://localhost:5173`

The vite config proxies `/api/*` requests to `http://localhost:8080` (your Spring Boot backend)

### 3. Production Build
Build React for deployment:
```bash
npm run build
```
Output goes to: `src/main/resources/static/`

### 4. Run Full Stack
```bash
# Terminal 1: Start React dev server
cd frontend
npm run dev

# Terminal 2: Start Spring Boot (from project root)
./mvnw spring-boot:run
```

## How Backend & Frontend Work Together

1. **Frontend Development** (`npm run dev`): Vite dev server runs on port 5173
2. **API Calls**: React makes requests to `/api/...` which proxies to Spring Boot on 8080
3. **Production**: Build React with `npm run build`, Spring Boot serves from `src/main/resources/static/`

## Project Structure
```
demo/
  frontend/           ← React app (Vite)
    src/
      App.jsx        ← Main component
      main.jsx
    vite.config.js   ← Build config (outputs to Spring Boot's static folder)
    package.json
  src/main/
    java/            ← Spring Boot backend
    resources/
      static/        ← React build output goes here
  pom.xml            ← Maven config
```

## Create React Endpoint Example

In your Spring Boot controller:
```java
@RestController
@RequestMapping("/api")
public class ApiController {
    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello from Spring Boot!");
    }
}
```

In your React component:
```jsx
useEffect(() => {
  fetch('/api/hello')
    .then(res => res.json())
    .then(data => console.log(data.message));
}, []);
```
