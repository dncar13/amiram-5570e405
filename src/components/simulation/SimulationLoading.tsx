
import { RTLWrapper } from "@/components/ui/rtl-wrapper";
import Header from "@/components/Header";

export const SimulationLoading = () => {
  return (
    <RTLWrapper className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-grow py-4 md:py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12 mb-4">
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-t-blue-600 border-r-blue-600/50 border-b-blue-600/30 border-l-blue-600/10 rounded-full animate-spin"></div>
              </div>
              <p className="text-lg font-medium text-electric-slate">טוען סימולציה...</p>
            </div>
          </div>
        </div>
      </main>
    </RTLWrapper>
  );
};
