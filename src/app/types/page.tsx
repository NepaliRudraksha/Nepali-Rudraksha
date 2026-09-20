import { redirect } from 'next/navigation';

export default function TypesPage() {
  redirect('/shop?category=types');
}