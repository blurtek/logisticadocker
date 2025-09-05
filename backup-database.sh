#!/bin/bash

# Script de backup automático para MueblesWow
# Ejecutar: ./backup-database.sh

BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="muebleswow_backup_$DATE.sql"

echo "💾 Iniciando backup de la base de datos..."

# Crear directorio de backups si no existe
mkdir -p $BACKUP_DIR

# Verificar si estamos usando PostgreSQL o SQLite
if grep -q "postgresql" backend/prisma/schema.prisma; then
    echo "🗄️ Detectado PostgreSQL, creando backup..."
    
    # Backup de PostgreSQL
    PGPASSWORD=muebleswow123 pg_dump -h localhost -U muebleswow -d muebleswow > "$BACKUP_DIR/$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backup de PostgreSQL completado: $BACKUP_DIR/$BACKUP_FILE"
    else
        echo "❌ Error al crear backup de PostgreSQL"
        exit 1
    fi
else
    echo "🗄️ Detectado SQLite, copiando archivo de base de datos..."
    
    # Backup de SQLite
    if [ -f "backend/prisma/dev.db" ]; then
        cp backend/prisma/dev.db "$BACKUP_DIR/muebleswow_backup_$DATE.db"
        echo "✅ Backup de SQLite completado: $BACKUP_DIR/muebleswow_backup_$DATE.db"
    else
        echo "❌ No se encontró el archivo de base de datos SQLite"
        exit 1
    fi
fi

# Comprimir el backup
if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    echo "🗜️ Backup comprimido: $BACKUP_DIR/$BACKUP_FILE.gz"
elif [ -f "$BACKUP_DIR/muebleswow_backup_$DATE.db" ]; then
    gzip "$BACKUP_DIR/muebleswow_backup_$DATE.db"
    echo "🗜️ Backup comprimido: $BACKUP_DIR/muebleswow_backup_$DATE.db.gz"
fi

# Mantener solo los últimos 10 backups
echo "🧹 Limpiando backups antiguos (manteniendo los últimos 10)..."
if grep -q "postgresql" backend/prisma/schema.prisma; then
    ls -t "$BACKUP_DIR"/muebleswow_backup_*.sql.gz | tail -n +11 | xargs -r rm
else
    ls -t "$BACKUP_DIR"/muebleswow_backup_*.db.gz | tail -n +11 | xargs -r rm
fi

echo "🎉 Backup completado exitosamente!"
echo "📁 Ubicación: $BACKUP_DIR/"
echo "📅 Fecha: $(date)"
