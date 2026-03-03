'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

const SignIn = () => {
  const [loading, setLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      await signIn('github', {
        redirect: true,
        callbackUrl: `/`,
      });
      toast.success('Successfully signed in with GitHub!')
    } catch (error) {
      console.error('GitHub sign-in failed:', error);
      toast.error('Failed to sign in with GitHub.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-sm max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign In with GitHub</h2>

      <Button
        onClick={handleGitHubSignIn}
        className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-semibold rounded-md"
        loading={loading}
        loadingText="Redirecting..."
      >
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default SignIn;
