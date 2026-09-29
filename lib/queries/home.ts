import { db } from '@/lib/db';
import { getSiteNotices } from './site-notices';

export async function getHomeInitialData() {
  try {
    const [updatesData, couponsData, noticesData] = await Promise.all([
      db.query(`
        SELECT title, link, date
        FROM updates
        ORDER BY date DESC
        LIMIT 5
      `),
      db.query(`
        SELECT
          code,
          title,
          description,
          start_date,
          end_date,
          created_at,
          CASE
            WHEN end_date < CURRENT_DATE THEN 'expired'
            ELSE 'active'
          END as status
        FROM coupons
        ORDER BY
          CASE
            WHEN end_date < CURRENT_DATE THEN 1
            ELSE 0
          END,
          created_at DESC
      `),
      getSiteNotices(5),
    ]);

    return {
      updates: updatesData.rows,
      coupons: couponsData.rows,
      notices: noticesData,
    };
  } catch {
    return { updates: [], coupons: [], notices: [] };
  }
}
