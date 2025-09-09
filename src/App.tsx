import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NovoTicket from "./pages/NovoTicket";
import FAQ from "./pages/FAQ";
import Relatorios from "./pages/Relatorios";
import TodosChamados from "./pages/TodosChamados";
import PesquisarTickets from "./pages/PesquisarTickets";
import EditarTicket from "./pages/EditarTicket";
import VisualizarTicket from "./pages/VisualizarTicket";
import Usuarios from "./pages/Usuarios";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <Layout>
              <Dashboard />
            </Layout>
          } />
          <Route path="/novo-ticket" element={
            <Layout>
              <NovoTicket />
            </Layout>
          } />
          <Route path="/meus-tickets" element={
            <Layout>
              <PesquisarTickets />
            </Layout>
          } />
          <Route path="/editar-ticket/:id" element={
            <Layout>
              <EditarTicket />
            </Layout>
          } />
          <Route path="/visualizar-ticket/:id" element={
            <Layout>
              <VisualizarTicket />
            </Layout>
          } />
          <Route path="/faq" element={
            <Layout>
              <FAQ />
            </Layout>
          } />
          <Route path="/relatorios" element={
            <Layout>
              <Relatorios />
            </Layout>
          } />
          <Route path="/todos-chamados" element={
            <Layout>
              <TodosChamados />
            </Layout>
          } />
          <Route path="/usuarios" element={
            <Layout>
              <Usuarios />
            </Layout>
          } />
          <Route path="/perfil" element={
            <Layout>
              <Perfil />
            </Layout>
          } />
          <Route path="/configuracoes" element={
            <Layout>
              <Configuracoes />
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={
            <Layout>
              <NotFound />
            </Layout>
          } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
