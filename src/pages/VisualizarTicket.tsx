import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, User, Calendar, Tag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

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
  comentarios: Array<{
    id: string;
    texto: string;
    autor: string;
    data: string;
  }>;
}

// Mock data - em um app real, viria de uma API
const mockTickets: Record<string, Ticket> = {
  "TK-001": {
    id: "TK-001",
    titulo: "Problema no sistema de login",
    descricao: "Usuários não conseguem fazer login no sistema após a última atualização. O erro aparece na tela de autenticação e impede o acesso ao sistema.",
    status: "Em Andamento",
    prioridade: "Alta",
    categoria: "Sistema",
    usuario: "João Silva",
    dataCriacao: "2024-01-15",
    dataAtualizacao: "2024-01-16",
    comentarios: [
      {
        id: "1",
        texto: "Problema identificado no servidor de autenticação. Equipe técnica foi acionada.",
        autor: "Suporte Técnico",
        data: "2024-01-16"
      }
    ]
  },
  "TK-003": {
    id: "TK-003",
    titulo: "Solicitação de acesso ao módulo financeiro",
    descricao: "Preciso de acesso para visualizar dados financeiros da empresa para gerar relatórios mensais.",
    status: "Resolvido",
    prioridade: "Baixa",
    categoria: "Acesso",
    usuario: "Carlos Oliveira",
    dataCriacao: "2024-01-13",
    dataAtualizacao: "2024-01-15",
    comentarios: [
      {
        id: "1",
        texto: "Solicitação aprovada pelo gestor. Acesso concedido.",
        autor: "Admin Sistema",
        data: "2024-01-15"
      },
      {
        id: "2",
        texto: "Acesso ao módulo financeiro foi liberado com sucesso. Usuário pode acessar os relatórios.",
        autor: "Suporte Técnico",
        data: "2024-01-15"
      }
    ]
  },
  "TK-004": {
    id: "TK-004",
    titulo: "Sistema fora do ar",
    descricao: "Aplicação completamente inacessível desde as 14h. Todos os usuários reportaram o problema.",
    status: "Fechado",
    prioridade: "Crítica",
    categoria: "Infraestrutura",
    usuario: "Ana Costa",
    dataCriacao: "2024-01-10",
    dataAtualizacao: "2024-01-12",
    comentarios: [
      {
        id: "1",
        texto: "Problema identificado no servidor principal. Realizando manutenção emergencial.",
        autor: "Suporte Técnico",
        data: "2024-01-10"
      },
      {
        id: "2",
        texto: "Servidor restaurado. Sistema funcionando normalmente.",
        autor: "Admin Sistema",
        data: "2024-01-12"
      },
      {
        id: "3",
        texto: "Chamado fechado após confirmação de funcionamento normal por 24h.",
        autor: "Suporte Técnico",
        data: "2024-01-12"
      }
    ]
  }
};

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

export default function VisualizarTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ticket = id ? mockTickets[id] : null;

  if (!ticket) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">Chamado não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              O chamado solicitado não existe ou foi removido.
            </p>
            <Button onClick={() => navigate("/meus-tickets")}>
              Voltar para Meus Chamados
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate("/meus-tickets")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Visualizar Chamado {ticket.id}
          </h1>
          <p className="text-muted-foreground mt-2">
            Detalhes completos do chamado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Chamado</CardTitle>
              <CardDescription>
                Detalhes completos do chamado (somente leitura)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={ticket.titulo}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={ticket.descricao}
                  readOnly
                  rows={4}
                  className="bg-muted cursor-not-allowed resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Input
                    value={ticket.categoria}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                    <Badge variant="secondary" className={priorityColors[ticket.prioridade]}>
                      {ticket.prioridade}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Criação</Label>
                  <Input
                    value={new Date(ticket.dataCriacao).toLocaleDateString('pt-BR')}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Última Atualização</Label>
                  <Input
                    value={new Date(ticket.dataAtualizacao).toLocaleDateString('pt-BR')}
                    readOnly
                    className="bg-muted cursor-not-allowed"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Histórico de Comentários
              </CardTitle>
              <CardDescription>
                Acompanhe todas as atualizações do chamado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ticket.comentarios.map((comentario) => (
                  <div 
                    key={comentario.id} 
                    className="p-4 border rounded-lg bg-muted/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{comentario.autor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(comentario.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <p className="text-sm">{comentario.texto}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Status do Chamado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status Atual</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                  <Badge variant="secondary" className={statusColors[ticket.status]}>
                    {ticket.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prioridade</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                  <Badge variant="secondary" className={priorityColors[ticket.prioridade]}>
                    {ticket.prioridade}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações do Solicitante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Input
                  value={ticket.usuario}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label>ID do Chamado</Label>
                <Input
                  value={ticket.id}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Modo Visualização
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                    Este chamado está sendo exibido apenas para consulta. 
                    Nenhuma alteração pode ser feita.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}