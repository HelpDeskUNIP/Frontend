import { useState } from "react";
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

// Mock data for tickets
const mockTickets = [
  {
    id: "HD-2024-001",
    title: "Impressora não funciona no setor financeiro",
    category: "Hardware",
    priority: "Alta",
    status: "Aberto",
    user: "Maria Silva",
    department: "Financeiro",
    created: "2024-01-15 09:30",
    description: "A impressora HP LaserJet do setor financeiro parou de funcionar"
  },
  {
    id: "HD-2024-002", 
    title: "Sistema ERP lento",
    category: "Software",
    priority: "Crítica",
    status: "Em Andamento",
    user: "João Santos",
    department: "Operações",
    created: "2024-01-15 08:15",
    description: "O sistema ERP está muito lento afetando todo o setor"
  },
  {
    id: "HD-2024-003",
    title: "Mouse sem fio não conecta",
    category: "Periféricos", 
    priority: "Baixa",
    status: "Resolvido",
    user: "Ana Costa",
    department: "RH",
    created: "2024-01-14 16:20",
    description: "Mouse sem fio não está conectando ao computador"
  }
];

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
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredTickets = mockTickets.filter(ticket => {
    const priorityMatch = filterPriority === "all" || ticket.priority === filterPriority;
    const statusMatch = filterStatus === "all" || ticket.status === filterStatus;
    return priorityMatch && statusMatch;
  });

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
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-primary">127</div>
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
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-warning">23</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              8 críticos, 15 de alta prioridade
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-card-hover transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Resolvidos</CardTitle>
            <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-xl lg:text-2xl font-bold text-success">104</div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Tempo médio de resolução: 2.5 horas
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
                      <div className="font-medium text-xs md:text-sm truncate max-w-[150px] md:max-w-none">{ticket.title}</div>
                      <div className="text-xs text-muted-foreground">{ticket.created}</div>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">{ticket.category}</Badge>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle">
                      <Badge 
                        className={`text-xs ${priorityColorsBg[ticket.priority as keyof typeof priorityColorsBg]}`}
                      >
                        {ticket.priority}
                      </Badge>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle">
                      <Badge className={`text-xs ${statusColors[ticket.status as keyof typeof statusColors]}`}>
                        {ticket.status}
                      </Badge>
                    </td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle hidden md:table-cell text-sm">{ticket.user}</td>
                    <td className="h-10 md:h-12 px-2 md:px-4 align-middle hidden lg:table-cell text-sm">{ticket.department}</td>
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