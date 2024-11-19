import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

export async function POST(request: Request) {
  try {
    const { email, password, role, profileData } = await request.json();

    const connectionString = 
      `Server=tcp:petarogyaserver.database.windows.net,1433;` +
      `Initial Catalog=petarogyadb;` +
      `User ID=taneshq;` +
      `Password=tVjs$dGGpP3z6N;` +
      `Encrypt=True;` +
      `TrustServerCertificate=False;`;

    const pool = await sql.connect(connectionString);
    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin();

      // Check if user exists
      const userCheck = await transaction.request()
        .input('email', sql.VarChar, email)
        .query('SELECT email FROM Users WHERE email = @email');

      if (userCheck.recordset.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const userResult = await transaction.request()
        .input('email', sql.VarChar, email)
        .input('password_hash', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, role)
        .query(`
          INSERT INTO Users (email, password_hash, role)
          OUTPUT INSERTED.user_id
          VALUES (@email, @password_hash, @role)
        `);

      const userId = userResult.recordset[0].user_id;

      // Create profile based on role
      if (role === 'pet_owner') {
        await transaction.request()
          .input('user_id', sql.UniqueIdentifier, userId)
          .input('owner_name', sql.VarChar, profileData.fullName)
          .input('owner_contact', sql.VarChar, profileData.contactNumber)
          .query(`
            INSERT INTO Pet_Owners (user_id, owner_name, owner_contact)
            VALUES (@user_id, @owner_name, @owner_contact)
          `);
      } else if (role === 'veterinary') {
        await transaction.request()
          .input('user_id', sql.UniqueIdentifier, userId)
          .input('license_number', sql.VarChar, profileData.licenseNumber)
          .input('full_name', sql.VarChar, profileData.fullName)
          .input('specialization', sql.VarChar, profileData.specialization)
          .input('contact_number', sql.VarChar, profileData.contactNumber)
          .input('clinic_address', sql.Text, profileData.clinicAddress)
          .query(`
            INSERT INTO Veterinarians (
              user_id, license_number, full_name, 
              specialization, contact_number, clinic_address
            )
            VALUES (
              @user_id, @license_number, @full_name,
              @specialization, @contact_number, @clinic_address
            )
          `);
      }

      await transaction.commit();
      await pool.close();

      return NextResponse.json({ 
        success: true, 
        message: 'Registration successful' 
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 400 });
  }
} 