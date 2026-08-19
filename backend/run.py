"""
Script de ejecución para DinamicLocalFlows Backend
"""
import uvicorn

if __name__ == "__main__":
    print("🚀 Iniciando DinamicLocalFlows Backend API...")
    print("📡 API disponible en: http://localhost:8000")
    print("📚 Documentación Swagger: http://localhost:8000/api/docs")
    print("🔍 ReDoc: http://localhost:8000/redoc")
    print("\nPresiona Ctrl+C para detener el servidor\n")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
