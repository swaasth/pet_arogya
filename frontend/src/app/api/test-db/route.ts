import { NextResponse } from 'next/server';
import { getDbConnection } from '@/lib/db';

export async function GET() {
  try {
    const pool = await getDbConnection();
    const result = await pool.request().query('SELECT GETDATE() as currentTime');
    
    return NextResponse.json({ 
      status: 'Connected',
      serverTime: result.recordset[0].currentTime 
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json(
      { 
        status: 'Error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
} 