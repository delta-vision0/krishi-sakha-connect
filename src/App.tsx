import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LocationProvider } from "./hooks/useLocation";
import { UserPreferencesProvider } from "./contexts/UserPreferencesContext";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />
			<LocationProvider>
				<UserPreferencesProvider>
					<BrowserRouter>
						<Routes>
							<Route path="/" element={<Index />} />
							{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
							<Route path="*" element={<NotFound />} />
						</Routes>
					</BrowserRouter>
				</UserPreferencesProvider>
			</LocationProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
