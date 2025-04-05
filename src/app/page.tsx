import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Home() {
  const { getAccessToken } = getKindeServerSession();
  const token = await getAccessToken();

  return (
    <div className="container">
      <pre className="p-4 rounded-lg bg-slate-900 text-lime-200">
        <code>{JSON.stringify(token, null, 2)}</code>
      </pre>

      <div className="card hero">
        <p className="text-display-1 hero-title">
          Let’s start authenticating <br /> with KindeAuth
        </p>
        <p className="text-body-1 hero-tagline">Configure your app</p>

        <Link
          href="https://kinde.com/docs/sdks/nextjs-sdk"
          target="_blank"
          rel="noreferrer"
          className="btn btn-light btn-big"
        >
          Go to docs
        </Link>
      </div>
    </div>
  );
}
