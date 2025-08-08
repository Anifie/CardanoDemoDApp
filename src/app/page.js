'use client';
import { useWeb3Auth } from "../common/service/useWeb3Auth";
import { useMembership } from "../common/service/useMembership";
import { useEffect } from "react";
import { OnboardingSection } from "@app/components/page-components";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <OnboardingSection />
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2024 Anifie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
