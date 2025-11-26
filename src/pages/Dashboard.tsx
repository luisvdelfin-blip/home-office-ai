import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  LogOut, 
  Users, 
  MessageSquare, 
  Loader2,
  Copy,
  Download,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdResult {
  anuncio: string;
  imagem: string;
}

const Dashboard = () => {
  const [productName, setProductName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [adResult, setAdResult] = useState<AdResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleGenerateAd = async () => {
    if (!productName.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, insira o nome do produto",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        "https://n8n.homeofficeinteligente.com.br/webhook/generar-anuncio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ producto: productName }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao gerar anúncio");
      }

      const data = await response.json();
      setAdResult(data);
      toast({
        title: "Anúncio gerado!",
        description: "Seu anúncio mágico está pronto",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o anúncio. Tente novamente.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    if (adResult?.anuncio) {
      navigator.clipboard.writeText(adResult.anuncio);
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência",
      });
    }
  };

  const handleDownloadImage = () => {
    if (adResult?.imagem) {
      window.open(adResult.imagem, "_blank");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-sidebar-primary" />
            <span className="text-lg font-bold text-sidebar-foreground">Home Office AI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant="secondary" 
            className="w-full justify-start bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Gerador de Anúncios
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <a href="https://crm.example.com" target="_blank" rel="noopener noreferrer">
              <Users className="mr-2 h-4 w-4" />
              Meu CRM
              <ExternalLink className="ml-auto h-4 w-4" />
            </a>
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <a href="https://whatsapp.example.com" target="_blank" rel="noopener noreferrer">
              <MessageSquare className="mr-2 h-4 w-4" />
              Conexão WhatsApp
              <ExternalLink className="ml-auto h-4 w-4" />
            </a>
          </Button>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Gerador de Anúncios Mágico
            </h1>
            <p className="text-muted-foreground">
              Cole o nome do produto e deixe a IA criar um anúncio irresistível
            </p>
          </div>

          <Card className="bg-card border-border">
            <CardContent className="pt-6 space-y-4">
              <div>
                <label htmlFor="product" className="text-sm font-medium text-foreground mb-2 block">
                  Nome do Produto
                </label>
                <Textarea
                  id="product"
                  placeholder="Ex: iPhone 15 Pro Max 256GB Azul"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="min-h-[100px] bg-secondary text-foreground border-border"
                  disabled={isGenerating}
                />
              </div>

              <Button 
                onClick={handleGenerateAd}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Gerando anúncio...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Gerar Anúncio Mágico
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {adResult && (
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Seu Anúncio Está Pronto!
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                 {/* Image Column - CORREGIDO */}
<div className="space-y-4">
  <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-secondary/50">
    {adResult.imagem ? (
      <img
        src={adResult.imagem}
        alt="Anúncio gerado"
        className="h-full w-full object-contain"
      />
    ) : (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <p>Aguardando imagem...</p>
      </div>
    )}
  </div>

  <Button variant="outline" className="w-full" asChild>
    <a href={adResult.imagem} target="_blank" rel="noopener noreferrer">
      <Download className="mr-2 h-4 w-4" />
      Abrir Imagem HD
    </a>
  </Button>
</div>

                  {/* Text */}
                  <div className="space-y-4">
                    <div className="bg-secondary p-4 rounded-lg border border-border min-h-[200px]">
                      <p className="text-foreground whitespace-pre-wrap">
                        {adResult.anuncio}
                      </p>
                    </div>
                    <Button 
                      onClick={handleCopyText}
                      variant="outline"
                      className="w-full"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copiar Texto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
