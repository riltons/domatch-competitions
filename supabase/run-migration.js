import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

dotenv.config({ path: '../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  const PROJECT_ID = 'qaslqmnbsgugvnmbtabg';
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!PROJECT_ID || !SUPABASE_KEY) {
    console.error('PROJECT_ID e SUPABASE_KEY são necessários');
    process.exit(1);
  }

  try {
    const migrationFile = process.argv[2];
    if (!migrationFile) {
      console.error('Por favor, forneça o nome do arquivo de migração');
      process.exit(1);
    }

    const migrationPath = path.join(__dirname, 'migrations', migrationFile);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Habilita a extensão http
    const enableHttpResponse = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        query: 'CREATE EXTENSION IF NOT EXISTS "http";'
      })
    });

    if (!enableHttpResponse.ok) {
      const errorText = await enableHttpResponse.text();
      console.error('Headers:', enableHttpResponse.headers);
      throw new Error(`Erro ao habilitar extensão http: ${errorText}`);
    }

    // Cria a função e os triggers
    const response = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Headers:', response.headers);
      throw new Error(`Erro ao executar migration: ${errorText}`);
    }

    console.log(`Migration ${migrationFile} executada com sucesso`);
  } catch (error) {
    console.error('Erro ao executar migration:', error);
    process.exit(1);
  }
}

runMigration();
