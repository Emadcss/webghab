
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'webghab_luxury_secret_2024';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const result = await pool.query('SELECT id, name, email, role, phone, national_id, wallet_balance, status FROM users WHERE id = $1', [decoded.userId]);
    if (result.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(result.rows[0]);
  } catch (err: any) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
