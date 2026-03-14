import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Fetch all registered projects from the database
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (projects.length === 0) {
      return NextResponse.json({ projects: [] });
    }

    // 2. Map through each project and fetch its real live status
    const liveMetrics = await Promise.all(
      projects.map(async (project: any) => {
        let dbStatus = "Disconnected";
        let apiStatus = "Down";
        let activeConnections = 0;
        let latency = "Timeout";
        let status = "error";
        let issue = "Connection Failed";

        const startTime = Date.now();

        try {
          // --- Check API Status ---
          const url = new URL('/rest/v1/', project.projectUrl);
          const apiRes = await fetch(url.toString(), {
            method: 'GET',
            headers: { 'apikey': project.serviceRoleKey },
            signal: AbortSignal.timeout(3000), 
          });
          if (apiRes.ok) {
            apiStatus = "Operational";
          }
        } catch (err: any) {
          console.error(`API Error for ${project.name}:`, err.message);
          issue = "API Timeout/Error";
        }

        try {
          // --- Check Database Status ---
          const pool = new Pool({
            connectionString: project.databaseUrl,
            connectionTimeoutMillis: 3000,
            ssl: { rejectUnauthorized: false } 
          });

          const connQuery = await pool.query(`
            SELECT count(*) 
            FROM pg_stat_activity 
            WHERE state = 'active';
          `);

          activeConnections = parseInt(connQuery.rows[0].count, 10);
          dbStatus = "Operational";
          
          await pool.end();
        } catch (err: any) {
          console.error(`DB Error for ${project.name}:`, err.message);
          issue = "Database Connection Refused";
        }

        const durationMs = Date.now() - startTime;
        latency = `${durationMs}ms`;

        // Determine overall status
        if (apiStatus === "Operational" && dbStatus === "Operational") {
          status = "healthy";
          issue = "";
        } else if (apiStatus === "Operational" || dbStatus === "Operational") {
          status = "warning";
        } else {
          status = "error";
          issue = "Total Outage";
        }

        return {
          id: project.id,
          name: project.name,
          environment: project.environment,
          status,
          api: apiStatus,
          db: dbStatus,
          connections: activeConnections,
          latency,
          issue
        };
      })
    );

    return NextResponse.json({ projects: liveMetrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
