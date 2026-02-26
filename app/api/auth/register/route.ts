
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'webghab_luxury_secret_2024';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    return NextResponse.json({ token, user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'ایمیل تکراری است یا خطایی در پایگاه داده رخ داده است.' }, { status: 400 });
  }
}
