import { NextResponse } from 'next/server';
import sql from 'mssql';

export async function GET() {
  const connectionString = 
    `Server=tcp:petarogyaserver.database.windows.net,1433;` +
    `Initial Catalog=petarogyadb;` +
    `Persist Security Info=False;` +
    `User ID=taneshq;` +
    `Password=tVjs$dGGpP3z6N;` +
    `MultipleActiveResultSets=False;` +
    `Encrypt=True;` +
    `TrustServerCertificate=False;` +
    `Connection Timeout=30;`;

  try {
    console.log('Attempting connection with connection string...');
    
    const pool = await sql.connect(connectionString);
    const result = await pool.request().query('SELECT GETDATE() as currentTime');
    await pool.close();

    return NextResponse.json({
      success: true,
      time: result.recordset[0].currentTime
    });
  } catch (err) {
    console.error('Connection error:', {
      message: err.message,
      code: err.code
    });
    
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 500 });
  }
} 