#!/bin/bash

echo "🚀 Iniciando AgroIA - Backend y Frontend"
echo ""

echo "📦 Iniciando Backend..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/backend && npm run dev"'

echo "⏳ Esperando 3 segundos..."
sleep 3

echo "🌐 Iniciando Frontend..."
osascript -e 'tell application "Terminal" to do script "cd '$(pwd)'/frontend && npm run dev"'

echo ""
echo "✅ Ambos servicios iniciados"
echo "🔗 Backend: http://localhost:3001"
echo "🔗 Frontend: http://localhost:5173"
echo ""
echo "Presiona Enter para continuar..."
read
