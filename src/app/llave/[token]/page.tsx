import { AkelarreExperience } from '@/components/AkelarreExperience';

interface LlavePageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function LlavePage({ params }: LlavePageProps) {
  const { token } = await params;
  return <AkelarreExperience initialToken={token} />;
}
