import Calendar from '@/components/Calendar';
import styles from './page.module.css';
import { UserButton, currentUser } from '@clerk/nextjs';

export default async function Home() {
  const user = await currentUser();
  const email = user?.emailAddresses[0].emailAddress;

  return (
    <>
      <header>
        <div className='m-4 text-md flex gap-2 items-center justify-end'>
          {email}
          <UserButton afterSignOutUrl='/' />
        </div>
      </header>
      <main className='m-4 flex justify-center'>
        <div className='w-4/5'>
          <Calendar />
        </div>
      </main>
    </>
  );
}
