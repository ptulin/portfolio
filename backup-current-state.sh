#!/bin/bash
# Backup Current Portfolio State
# Creates a timestamped backup of the current project state before production cleanup

BACKUP_DIR="backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="portfolio_backup_${TIMESTAMP}"

echo "🔄 Creating backup: ${BACKUP_NAME}"

# Create backup directory
mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"

# Copy entire project (excluding node_modules, .git, and backups)
rsync -av \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='backups' \
  --exclude='*.log' \
  --exclude='.DS_Store' \
  . "${BACKUP_DIR}/${BACKUP_NAME}/"

# Create a manifest of what was backed up
find "${BACKUP_DIR}/${BACKUP_NAME}" -type f | sort > "${BACKUP_DIR}/${BACKUP_NAME}/BACKUP_MANIFEST.txt"

echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_NAME}"
echo "📋 Files backed up: $(find "${BACKUP_DIR}/${BACKUP_NAME}" -type f | wc -l | tr -d ' ')"
echo ""
echo "To restore: cp -r ${BACKUP_DIR}/${BACKUP_NAME}/* ."

