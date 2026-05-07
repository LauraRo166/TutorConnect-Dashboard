import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-base">TC</span>
          </div>
          <span className="text-xl font-bold text-tc-text">TutorConnect</span>
        </div>
        <p className="text-sm text-tc-muted">Panel de Administración</p>
      </div>

      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#006A75',
            colorText: '#0F172A',
            colorTextSecondary: '#475569',
            colorBackground: '#ffffff',
            colorInputBackground: '#ffffff',
            colorInputText: '#0F172A',
            borderRadius: '0.5rem',
          },
          elements: {
            card: 'shadow-md border border-tc-border',
            headerTitle: 'text-tc-text font-semibold',
            headerSubtitle: 'text-tc-muted',
            formButtonPrimary:
              'bg-primary hover:bg-primary/90 text-white font-medium',
            footerActionLink: 'text-primary hover:text-primary/80',
          },
        }}
      />
    </div>
  );
}
