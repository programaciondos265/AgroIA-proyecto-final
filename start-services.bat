@echo off
echo Iniciando AgroIA - Backend y Frontend
echo.

echo Iniciando Backend...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Iniciando Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Ambos servicios iniciados
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul
