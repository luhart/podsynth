import { createClient } from '@/utils/supabase/server';
import { MailCheck } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ConfirmEmail({
  params,
  searchParams
}: {
  params: any;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/account');
  }

  const email = searchParams.email as string;

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between w-full max-w-md px-4 py-6 border rounded-md mt-12">
        {/* welcome message */}
        <div className="">
          <div className="flex flex-row gap-2 items-center">
            <MailCheck className="w-5 h-5 text-gray-500" />
            <h4 className="text-lg font-semibold text-left">
              Confirm your email address
            </h4>
          </div>

          {email ? (
            <p className="text-gray-600 mt-2 text-sm">
              We&apos;ve sent an email to{' '}
              <span className="font-semibold">{email}</span> to confirm your
              email address. Please click the link in the email to sign in.
            </p>
          ) : (
            <p className="text-gray-600 mt-2 text-sm">
              We&apos;ve sent a confirmation email to your email address. Please
              click the link in the email we sent to complete your account signup.
            </p>
          )}

          {/* Need help? */}
          <div className="mt-2">
            <p className="text-gray-600 text-sm">
              Need help?{' '}
              <a
                href="mailto:support@platdrop.com"
                className="text-blue-600 hover:underline"
              >
                Contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
