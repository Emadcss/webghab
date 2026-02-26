
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'webghab_luxury_secret_2024';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'ایمیل یا رمز عبور اشتباه است.' }, { status: 400 });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    delete user.password;
    return NextResponse.json({ token, user });
  } catch (err: any) {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}
