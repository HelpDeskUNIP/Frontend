import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { 
  Search, 
  Filter,
  Eye,
  Edit,
  Ticket,
  Calendar,
  User,
  AlertCircle,
  Clock,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  status: "Aberto" | "Em Andamento" | "Resolvido" | "Fechado";
  prioridade: "Crítica" | "Alta" | "Média" | "Baixa";
  categoria: string;
  subcategoria?: string;
  usuario: string;
  departamento: string;
  dataAbertura: string;
  dataVencimento: string;
  dataResolucao?: string;
  tempoResposta?: string;
  sla: "Normal" | "Crítico" | "Vencido";
}

// Mock data com mais tickets
const mockTickets: Ticket[] = [
  {
    id: "TK-2024-001",
    titulo: "Problema no login do sistema",
    descricao: "Usuário não consegue acessar o sistema após trocar a senha",
    status: "Aberto",
    prioridade: "Alta",
    categoria: "TI",
    subcategoria: "Acessos",
    usuario: "Maria Silva",
    departamento: "Financeiro",
    dataAbertura: "2024-01-15 09:30",
    dataVencimento: "2024-01-15 17:30",
    sla: "Normal"
  },
  {
    id: "TK-2024-002",
    titulo: "Computador não liga",
    descricao: "Equipamento da estação 12 não está funcionando",
    status: "Em Andamento",
    prioridade: "Crítica",
    categoria: "TI",
    subcategoria: "Hardware",
    usuario: "João Santos",
    departamento: "Operações",
    dataAbertura: "2024-01-15 10:15",
    dataVencimento: "2024-01-15 14:15",
    sla: "Crítico"
  },
  {
    id: "TK-2024-003",
    titulo: "Instalação de software",
    descricao: "Necessidade de instalar novo software de design",
    status: "Resolvido",
    prioridade: "Média",
    categoria: "TI",
    subcategoria: "Software",
    usuario: "Ana Costa",
    departamento: "Marketing",
    dataAbertura: "2024-01-14 14:20",
    dataVencimento: "2024-01-16 14:20",
    dataResolucao: "2024-01-15 16:45",
    tempoResposta: "1d 2h 25m",
    sla: "Normal"
  },
  {
    id: "TK-2024-004",
    titulo: "Problema na impressora",
    descricao: "Impressora do 2º andar não está imprimindo",
    status: "Fechado",
    prioridade: "Baixa",
    categoria: "TI",
    subcategoria: "Hardware",
    usuario: "Carlos Oliveira",
    departamento: "RH",
    dataAbertura: "2024-01-12 11:00",
    dataVencimento: "2024-01-18 11:00",
    dataResolucao: "2024-01-13 09:30",
    tempoResposta: "22h 30m",
    sla: "Normal"
  },
  {
    id: "TK-2024-005",
    titulo: "Erro no sistema de vendas",
    descricao: "Sistema apresenta erro ao processar vendas",
    status: "Aberto",
    prioridade: "Crítica",
    categoria: "TI",
    subcategoria: "Software",
    usuario: "Fernanda Lima",
    departamento: "Vendas",
    dataAbertura: "2024-01-15 08:00",
    dataVencimento: "2024-01-15 12:00",
    sla: "Vencido"
  },
  {
    id: "TK-2024-006",
    titulo: "Liberação de acesso ao sistema",
    descricao: "Novo funcionário precisa de acesso aos sistemas",
    status: "Em Andamento",
    prioridade: "Média",
    categoria: "TI",
    subcategoria: "Acessos",
    usuario: "Roberto Dias",
    departamento: "RH",
    dataAbertura: "2024-01-15 13:45",
    dataVencimento: "2024-01-17 13:45",
    sla: "Normal"
  }
];

const statusColors = {
  "Aberto": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Em Andamento": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Resolvido": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Fechado": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
};

const priorityColors = {
  "Crítica": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  "Alta": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Média": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Baixa": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
};

const slaColors = {
  "Normal": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "Crítico": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  "Vencido": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
};

export default function TodosChamados() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [priorityFilter, setPriorityFilter] = useState<string>("todas");
  const [departmentFilter, setDepartmentFilter] = useState<string>("todos");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "todas" || ticket.prioridade === priorityFilter;
    const matchesDepartment = departmentFilter === "todos" || ticket.departamento === departmentFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  const handleViewTicket = (ticketId: string) => {
    navigate(`/visualizar-ticket/${ticketId}`);
  };

  const handleEditTicket = (ticketId: string) => {
    navigate(`/editar-ticket/${ticketId}`);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Todos os Chamados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Todos os Chamados</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os chamados do sistema
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar chamados específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por título, descrição, usuário ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="Aberto">Aberto</SelectItem>
                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                <SelectItem value="Resolvido">Resolvido</SelectItem>
                <SelectItem value="Fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Prioridades</SelectItem>
                <SelectItem value="Crítica">Crítica</SelectItem>
                <SelectItem value="Alta">Alta</SelectItem>
                <SelectItem value="Média">Média</SelectItem>
                <SelectItem value="Baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Departamentos</SelectItem>
                <SelectItem value="TI">TI</SelectItem>
                <SelectItem value="Financeiro">Financeiro</SelectItem>
                <SelectItem value="RH">RH</SelectItem>
                <SelectItem value="Operações">Operações</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Vendas">Vendas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Exibindo {filteredTickets.length} de {mockTickets.length} chamados
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Chamados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Lista de Chamados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Data Abertura</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Ticket className="h-8 w-8" />
                        <p>Nenhum chamado encontrado com os filtros aplicados</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono text-sm">
                        {ticket.id}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate font-medium">{ticket.titulo}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.categoria} - {ticket.subcategoria}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {ticket.usuario}
                        </div>
                      </TableCell>
                      <TableCell>{ticket.departamento}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={statusColors[ticket.status]}
                        >
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={priorityColors[ticket.prioridade]}
                        >
                          {ticket.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={slaColors[ticket.sla]}
                        >
                          <div className="flex items-center gap-1">
                            {ticket.sla === "Normal" && <CheckCircle className="h-3 w-3" />}
                            {ticket.sla === "Crítico" && <Clock className="h-3 w-3" />}
                            {ticket.sla === "Vencido" && <AlertCircle className="h-3 w-3" />}
                            {ticket.sla}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {new Date(ticket.dataAbertura).toLocaleDateString('pt-BR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTicket(ticket.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}