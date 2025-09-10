import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TicketPlus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  Filter
} from "lucide-react";
import heroImage from "@/assets/helpdesk-hero.jpg";
import { useTickets, Ticket } from "@/hooks/use-tickets";

// Helpers
const formatDateTime = (iso?: string) => {
  if (!iso) return "";
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
};

const priorityColors = {
  "Crítica": "bg-priority-critical text-white",
  "Alta": "bg-priority-high text-white", 
  "Média": "bg-priority-medium text-white",
  "Baixa": "bg-priority-low text-white"
};

  const priorityColorsBg = {
    "Crítica": "bg-red-50 text-red-700 border-red-200",
    "Alta": "bg-orange-50 text-orange-700 border-orange-200", 
    "Média": "bg-orange-50 text-orange-700 border-orange-200",
    "Baixa": "bg-green-50 text-green-700 border-green-200"
  };

const statusColors = {
  "Aberto": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Em Andamento": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", 
  "Resolvido": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Fechado": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { tickets } = useTickets();
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const sortedTickets = useMemo(() =>
    [...tickets].sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
  , [tickets]);

  const filteredTickets = useMemo(() => {
    return sortedTickets.filter((ticket) => {
      const priorityMatch = filterPriority === "all" || ticket.prioridade === filterPriority;
      const statusMatch = filterStatus === "all" || ticket.status === filterStatus;
      return priorityMatch && statusMatch;
    });
  }, [sortedTickets, filterPriority, filterStatus]);

  // Metrics
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status !== "Resolvido" && t.status !== "Fechado");
  const openCount = openTickets.length;
  const openCritical = openTickets.filter(t => t.prioridade === "Crítica").length;
  const openHigh = openTickets.filter(t => t.prioridade === "Alta").length;
  const resolvedTickets = tickets.filter(t => t.status === "Resolvido");
  const resolvedCount = resolvedTickets.length;
  const avgResolutionHours = useMemo(() => {
    if (resolvedTickets.length === 0) return null;
    const sumMs = resolvedTickets.reduce((acc, t) => {
      const start = new Date(t.dataCriacao).getTime();
      const end = new Date(t.dataAtualizacao).getTime(); // aprox.: última atualização como resolução
      return acc + Math.max(0, end - start);
    }, 0);
    const avgMs = sumMs / resolvedTickets.length;
    const hours = avgMs / (1000 * 60 * 60);
    return Math.round(hours * 10) / 10; // 1 casa decimal
  }, [resolvedTickets]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-hero text-white">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="HelpDesk Professional" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative p-4 md:p-6 lg:p-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">Central de HelpDesk</h1>
          <p className="text-sm md:text-base lg:text-lg opacity-90 mb-4 md:mb-6">
            Gerencie todos os tickets de suporte da sua empresa de forma eficiente
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
            onClick={() => navigate("/novo-ticket")}
          >
            <TicketPlus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            <span className="text-sm md:text-base">Abrir Novo Ticket</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
    <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total de Tickets</CardTitle>
            <TicketPlus className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
      <div className="text-lg md:text-xl lg:text-2xl font-bold text-primary">{totalTickets}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% desde semana passada
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Em Aberto</CardTitle>
            <Clock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-warning">{openCount}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {openCritical} críticos, {openHigh} de alta prioridade
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-success">{resolvedCount}</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Tempo médio de resolução: {avgResolutionHours ?? "-"} {avgResolutionHours === 1 ? "hora" : "horas"}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-primary">45</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Conectados agora
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Table */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle className="text-lg md:text-xl">Tickets Recentes</CardTitle>
              <CardDescription className="text-sm">Gerencie e acompanhe todos os tickets de suporte</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Aberto">Aberto</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Resolvido">Resolvido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm">
                    Protocolo
                  </th>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm">
                    Título
                  </th>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm hidden sm:table-cell">
                    Categoria
                  </th>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm">
                    Prioridade
                  </th>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm">
                    Status
                  </th>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm hidden md:table-cell">
                    Usuário
                  </th>
                  <th className="h-10 md:h-12 px-2 md:px-4 text-left align-middle font-medium text-muted-foreground text-xs md:text-sm hidden lg:table-cell">
                    Setor
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle">
                      <code className="font-mono text-xs md:text-sm bg-muted px-1 md:px-2 py-1 rounded">
                        {ticket.id}
                      </code>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle">
                      <div className="font-medium text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{ticket.titulo}</div>
                      <div className="text-xs text-muted-foreground">{formatDateTime(ticket.dataCriacao)}</div>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{ticket.categoria}</Badge>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle">
                      <Badge 
                        className={`text-xs ${priorityColorsBg[ticket.prioridade as keyof typeof priorityColorsBg]}`}
                      >
                        {ticket.prioridade}
                      </Badge>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle">
                      <Badge className={`text-xs ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle hidden md:table-cell text-sm">{ticket.usuario}</td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle hidden lg:table-cell text-sm">{ticket.departamento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}