
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const productsResult = await pool.query(`
      SELECT p.*, 
      (SELECT json_agg(v) FROM product_variants v WHERE v.product_id = p.id) as variants
      FROM products p
    `);
    return NextResponse.json(productsResult.rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
