#!/bin/bash

# Script de restauración de base de datos para MueblesWow
# Uso: ./restore-database.sh [archivo_backup]

BACKUP_DIR="./backups"

echo "🔄 Script de restauración de base de datos MueblesWow"
echo ""

# Verificar si se proporcionó un archivo de backup
if [ -z "$1" ]; then
    echo "📋 Archivos de backup disponibles:"
    echo ""
    
    if [ -d "$BACKUP_DIR" ]; then
        if grep -q "postgresql" backend/prisma/schema.prisma; then
            # Listar backups de PostgreSQL
            backups=$(ls -t "$BACKUP_DIR"/muebleswow_backup_*.sql.gz 2>/dev/null)
        else
            # Listar backups de SQLite
            backups=$(ls -t "$BACKUP_DIR"/muebleswow_backup_*.db.gz 2>/dev/null)
        fi
        
        if [ -n "$backups" ]; then
            echo "Backups disponibles:"
            echo "$backups" | head -10
            echo ""
            echo "💡 Uso: ./restore-database.sh [archivo_backup]"
            echo "Ejemplo: ./restore-database.sh muebleswow_backup_20241201_143022.sql.gz"
        else
            echo "❌ No se encontraron archivos de backup en $BACKUP_DIR"
        fi
    else
        echo "❌ No existe el directorio de backups: $BACKUP_DIR"
    fi
    exit 1
fi

BACKUP_FILE="$1"

# Verificar si el archivo existe
if [ ! -f "$BACKUP_FILE" ] && [ ! -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    echo "❌ No se encontró el archivo de backup: $BACKUP_FILE"
    exit 1
fi

# Determinar la ruta completa del archivo
if [ -f "$BACKUP_FILE" ]; then
    FULL_PATH="$BACKUP_FILE"
else
    FULL_PATH="$BACKUP_DIR/$BACKUP_FILE"
fi

echo "🔄 Restaurando desde: $FULL_PATH"
echo "⚠️  ADVERTENCIA: Esta operación sobrescribirá la base de datos actual"
echo ""

read -p "¿Estás seguro de que quieres continuar? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restauración cancelada"
    exit 1
fi

# Verificar si estamos usando PostgreSQL o SQLite
if grep -q "postgresql" backend/prisma/schema.prisma; then
    echo "🗄️ Restaurando base de datos PostgreSQL..."
    
    # Descomprimir si es necesario
    if [[ "$FULL_PATH" == *.gz ]]; then
        echo "🗜️ Descomprimiendo archivo..."
        gunzip -c "$FULL_PATH" > "${FULL_PATH%.gz}"
        RESTORE_FILE="${FULL_PATH%.gz}"
    else
        RESTORE_FILE="$FULL_PATH"
    fi
    
    # Restaurar PostgreSQL
    psql -h localhost -U muebleswow -d muebleswow -f "$RESTORE_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Restauración de PostgreSQL completada"
    else
        echo "❌ Error al restaurar PostgreSQL"
        exit 1
    fi
    
    # Limpiar archivo temporal
    if [[ "$FULL_PATH" == *.gz ]]; then
        rm "$RESTORE_FILE"
    fi
else
    echo "🗄️ Restaurando base de datos SQLite..."
    
    # Detener el servidor si está corriendo
    echo "🛑 Deteniendo servidor..."
    pkill -f "npm run dev" 2>/dev/null || true
    sleep 2
    
    # Descomprimir si es necesario
    if [[ "$FULL_PATH" == *.gz ]]; then
        echo "🗜️ Descomprimiendo archivo..."
        gunzip -c "$FULL_PATH" > "${FULL_PATH%.gz}"
        RESTORE_FILE="${FULL_PATH%.gz}"
    else
        RESTORE_FILE="$FULL_PATH"
    fi
    
    # Restaurar SQLite
    cp "$RESTORE_FILE" backend/prisma/dev.db
    
    if [ $? -eq 0 ]; then
        echo "✅ Restauración de SQLite completada"
    else
        echo "❌ Error al restaurar SQLite"
        exit 1
    fi
    
    # Limpiar archivo temporal
    if [[ "$FULL_PATH" == *.gz ]]; then
        rm "$RESTORE_FILE"
    fi
fi

echo "🎉 Restauración completada exitosamente!"
echo "🚀 Puedes reiniciar el servidor con: npm run dev"
