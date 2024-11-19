import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { rows } = await sql`
      SELECT 
        d.DogID, 
        d.Name, 
        d.Breed, 
        d.DOB, 
        d.Gender, 
        d.ColorMarkings,
        d.MicrochipID,
        po.owner_name,
        po.owner_contact
      FROM Dogs d
      LEFT JOIN Dogs_Owners do ON d.DogID = do.dog_id
      LEFT JOIN Pet_Owners po ON do.owner_id = po.owner_id
    `;
    return NextResponse.json({ dogs: rows });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dogs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, breed, dob, gender, colorMarkings, microchipID, ownerInfo } = await request.json();
    
    // First insert the dog
    const { rows: [dog] } = await sql`
      INSERT INTO Dogs (Name, Breed, DOB, Gender, ColorMarkings, MicrochipID)
      VALUES (${name}, ${breed}, ${dob}, ${gender}, ${colorMarkings}, ${microchipID})
      RETURNING DogID
    `;

    // If owner info is provided, handle owner creation/association
    if (ownerInfo) {
      const { rows: [owner] } = await sql`
        INSERT INTO Pet_Owners (owner_name, owner_contact)
        VALUES (${ownerInfo.name}, ${ownerInfo.contact})
        RETURNING owner_id
      `;

      await sql`
        INSERT INTO Dogs_Owners (dog_id, owner_id)
        VALUES (${dog.DogID}, ${owner.owner_id})
      `;
    }

    return NextResponse.json({ success: true, dogId: dog.DogID });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create dog' }, { status: 500 });
  }
} 