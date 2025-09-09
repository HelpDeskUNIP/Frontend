import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Eye, Edit, CheckCircle } from "lucide-react";

interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  status: "Aberto" | "Em Andamento" | "Resolvido" | "Fechado";
  prioridade: "Crítica" | "Alta" | "Média" | "Baixa";
  categoria: string;
  usuario: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

const mockTickets: Ticket[] = [
  {
    id: "TK-001",
    titulo: "Problema no sistema de login",
    descricao: "Usuários não conseguem fazer login no sistema",
    status: "Em Andamento",
    prioridade: "Alta",
    categoria: "Sistema",
    usuario: "João Silva",
    dataCriacao: "2024-01-15",
    dataAtualizacao: "2024-01-16"
  },
  {
    id: "TK-002",
    titulo: "Erro no relatório de vendas",
    descricao: "Relatório não está gerando os dados corretamente",
    status: "Aberto",
    prioridade: "Média",
    categoria: "Relatórios",
    usuario: "Maria Santos",
    dataCriacao: "2024-01-14",
    dataAtualizacao: "2024-01-14"
  },
  {
    id: "TK-003",
    titulo: "Solicitação de acesso ao módulo financeiro",
    descricao: "Preciso de acesso para visualizar dados financeiros",
    status: "Resolvido",
    prioridade: "Baixa",
    categoria: "Acesso",
    usuario: "Carlos Oliveira",
    dataCriacao: "2024-01-13",
    dataAtualizacao: "2024-01-15"
  },
  {
    id: "TK-004",
    titulo: "Sistema fora do ar",
    descricao: "Aplicação completamente inacessível",
    status: "Fechado",
    prioridade: "Crítica",
    categoria: "Infraestrutura",
    usuario: "Ana Costa",
    dataCriacao: "2024-01-10",
    dataAtualizacao: "2024-01-12"
  }
];

const statusColors = {
  "Aberto": "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Em Andamento": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  "Resolvido": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  "Fechado": "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
};

const priorityColors = {
  "Crítica": "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "Alta": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  "Média": "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  "Baixa": "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
};

export default function PesquisarTickets() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [priorityFilter, setPriorityFilter] = useState<string>("todas");
  const [categoryFilter, setCategoryFilter] = useState<string>("todas");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.usuario.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "todos" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "todas" || ticket.prioridade === priorityFilter;
    const matchesCategory = categoryFilter === "todas" || ticket.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const ticketsAtivos = filteredTickets.filter(ticket => 
    ticket.status === "Aberto" || ticket.status === "Em Andamento"
  );

  const ticketsFinalizados = filteredTickets.filter(ticket => 
    ticket.status === "Resolvido" || ticket.status === "Fechado"
  );

  const handleEditTicket = (ticketId: string) => {
    navigate(`/editar-ticket/${ticketId}`);
  };

  const handleViewTicket = (ticketId: string) => {
    navigate(`/visualizar-ticket/${ticketId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Chamados</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie seus chamados ativos e acompanhe o histórico
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Pesquisa
          </CardTitle>
          <CardDescription>
            Use os filtros abaixo para encontrar chamados específicos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Pesquisar por ID, título, descrição ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtros Avançados
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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
            </div>

            <div>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
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
            </div>

            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Categorias</SelectItem>
                  <SelectItem value="Sistema">Sistema</SelectItem>
                  <SelectItem value="Relatórios">Relatórios</SelectItem>
                  <SelectItem value="Acesso">Acesso</SelectItem>
                  <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="ativos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ativos" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Chamados Ativos ({ticketsAtivos.length})
          </TabsTrigger>
          <TabsTrigger value="finalizados" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Chamados Finalizados ({ticketsFinalizados.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ativos">
          <Card>
            <CardHeader>
              <CardTitle>Chamados Ativos</CardTitle>
              <CardDescription>
                Chamados em aberto ou em andamento ({ticketsAtivos.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsAtivos.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.titulo}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {ticket.descricao}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[ticket.status]}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={priorityColors[ticket.prioridade]}>
                          {ticket.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.categoria}</TableCell>
                      <TableCell>{new Date(ticket.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
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
                  ))}
                </TableBody>
              </Table>

              {ticketsAtivos.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum chamado ativo encontrado.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finalizados">
          <Card>
            <CardHeader>
              <CardTitle>Chamados Finalizados</CardTitle>
              <CardDescription>
                Histórico de chamados resolvidos e fechados ({ticketsFinalizados.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data Criação</TableHead>
                    <TableHead>Data Finalização</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ticketsFinalizados.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ticket.titulo}</div>
                          <div className="text-sm text-muted-foreground truncate max-w-xs">
                            {ticket.descricao}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusColors[ticket.status]}>
                          {ticket.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={priorityColors[ticket.prioridade]}>
                          {ticket.prioridade}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.categoria}</TableCell>
                      <TableCell>{new Date(ticket.dataCriacao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{new Date(ticket.dataAtualizacao).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {ticketsFinalizados.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum chamado finalizado encontrado.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}