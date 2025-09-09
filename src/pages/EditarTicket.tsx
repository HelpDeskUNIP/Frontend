import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, MessageCircle, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comentario {
  id: string;
  autor: string;
  data: string;
  conteudo: string;
  tipo: "usuario" | "suporte";
}

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
  comentarios: Comentario[];
}

const mockTicket: Ticket = {
  id: "TK-001",
  titulo: "Problema no sistema de login",
  descricao: "Usuários não conseguem fazer login no sistema. O erro aparece após inserir as credenciais corretas.",
  status: "Em Andamento",
  prioridade: "Alta",
  categoria: "Sistema",
  usuario: "João Silva",
  dataCriacao: "2024-01-15",
  dataAtualizacao: "2024-01-16",
  comentarios: [
    {
      id: "1",
      autor: "João Silva",
      data: "2024-01-15 09:30",
      conteudo: "Chamado criado. Urgente resolução pois está afetando toda a equipe.",
      tipo: "usuario"
    },
    {
      id: "2",
      autor: "Suporte TI",
      data: "2024-01-15 10:15",
      conteudo: "Chamado recebido. Investigando o problema no servidor de autenticação.",
      tipo: "suporte"
    },
    {
      id: "3",
      autor: "Suporte TI",
      data: "2024-01-16 14:20",
      conteudo: "Identificamos o problema. Trabalhando na correção do banco de dados.",
      tipo: "suporte"
    }
  ]
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

export default function EditarTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [ticket, setTicket] = useState<Ticket>(mockTicket);
  const [novoComentario, setNovoComentario] = useState("");

  const handleSalvar = () => {
    toast({
      title: "Chamado atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleAdicionarComentario = () => {
    if (!novoComentario.trim()) return;

    const comentario: Comentario = {
      id: String(ticket.comentarios.length + 1),
      autor: "Usuário Atual",
      data: new Date().toLocaleString('pt-BR'),
      conteudo: novoComentario,
      tipo: "usuario"
    };

    setTicket(prev => ({
      ...prev,
      comentarios: [...prev.comentarios, comentario],
      dataAtualizacao: new Date().toISOString().split('T')[0]
    }));

    setNovoComentario("");
    
    toast({
      title: "Comentário adicionado",
      description: "Seu comentário foi adicionado ao chamado.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/meus-tickets')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gerenciar Chamado {ticket.id}
          </h1>
          <p className="text-muted-foreground mt-2">
            Altere o status e adicione comentários ao chamado
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Chamado</CardTitle>
              <CardDescription>
                Visualize os detalhes do chamado (somente leitura)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={ticket.titulo}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
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

              <div className="text-sm text-muted-foreground bg-blue-50/50 dark:bg-blue-950/50 p-3 rounded-md border-l-4 border-blue-400">
                <p><strong>Nota:</strong> O título, descrição, categoria e prioridade não podem ser alterados após a criação do chamado. Você pode alterar apenas o status e adicionar comentários.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Histórico de Comentários
              </CardTitle>
              <CardDescription>
                Acompanhe todas as atualizações do chamado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {ticket.comentarios.map((comentario, index) => (
                  <div key={comentario.id}>
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        comentario.tipo === 'suporte' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{comentario.autor}</span>
                          <Badge variant="outline" className={
                            comentario.tipo === 'suporte' 
                              ? 'text-blue-600 border-blue-200' 
                              : 'text-gray-600 border-gray-200'
                          }>
                            {comentario.tipo === 'suporte' ? 'Suporte' : 'Usuário'}
                          </Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {comentario.data}
                          </span>
                        </div>
                        <p className="text-sm">{comentario.conteudo}</p>
                      </div>
                    </div>
                    {index < ticket.comentarios.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="novo-comentario">Adicionar Comentário</Label>
                <Textarea
                  id="novo-comentario"
                  placeholder="Digite seu comentário ou atualização..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleAdicionarComentario}
                  disabled={!novoComentario.trim()}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Adicionar Comentário
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status do Chamado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status Atual</Label>
                <Select
                  value={ticket.status}
                  onValueChange={(value: "Aberto" | "Em Andamento" | "Resolvido" | "Fechado") => 
                    setTicket({...ticket, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aberto">Aberto</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Resolvido">Resolvido</SelectItem>
                    <SelectItem value="Fechado">Fechado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Badge variant="secondary" className={statusColors[ticket.status]}>
                  {ticket.status}
                </Badge>
                <Badge variant="secondary" className={priorityColors[ticket.prioridade]}>
                  {ticket.prioridade}
                </Badge>
              </div>

              <Button onClick={handleSalvar} className="w-full flex items-center gap-2">
                <Save className="h-4 w-4" />
                Salvar Status
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">ID do Chamado</Label>
                <p className="text-sm text-muted-foreground">{ticket.id}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Usuário</Label>
                <p className="text-sm text-muted-foreground">{ticket.usuario}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Data de Criação</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(ticket.dataCriacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Última Atualização</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(ticket.dataAtualizacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}