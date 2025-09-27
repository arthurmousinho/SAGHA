import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    GraduationCap,
    FileText,
    Users,
    CheckCircle,
    BarChart3,
    Shield,
    Zap,
    ArrowRight,
    Star,
} from "lucide-react"

export function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">SAGHA</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost">
                                Entrar
                            </Button>
                            <Button>Começar Agora</Button>
                        </div>
                    </div>
                </div>
            </nav>

            <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                                    <Star className="w-4 h-4 mr-2" />
                                    Sistema Acadêmico Moderno
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-bold text-foreground text-balance">
                                    Gerencie suas <span className="text-primary">horas acadêmicas</span> com simplicidade
                                </h1>
                                <p className="text-xl text-muted-foreground text-pretty max-w-2xl">
                                    O SAGHA revoluciona o acompanhamento de horas acadêmicas com uma plataforma intuitiva que conecta
                                    estudantes e coordenação de forma eficiente.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button size="lg" className="text-lg px-8">
                                    Começar Agora
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                                <Button size="lg" variant="outline">
                                    Ver Demonstração
                                </Button>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/40">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">100%</div>
                                    <div className="text-sm text-muted-foreground">Digital</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">24/7</div>
                                    <div className="text-sm text-muted-foreground">Disponível</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">Seguro</div>
                                    <div className="text-sm text-muted-foreground">& Confiável</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-3xl"></div>
                            <Card className="relative bg-card/50 backdrop-blur border-border/50">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-primary-foreground" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Dashboard do Aluno</CardTitle>
                                                <CardDescription>João Silva - Engenharia</CardDescription>
                                            </div>
                                        </div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progresso das Horas</span>
                                            <span className="font-semibold">180/200h</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="text-2xl font-bold text-primary">15</div>
                                            <div className="text-xs text-muted-foreground">Aprovadas</div>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="text-2xl font-bold text-accent">2</div>
                                            <div className="text-xs text-muted-foreground">Pendentes</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-foreground">Tudo que você precisa em um só lugar</h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Uma plataforma completa para gerenciar horas acadêmicas com eficiência e transparência
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Solicitações Rápidas</CardTitle>
                                <CardDescription>
                                    Envie suas solicitações de horas acadêmicas em segundos com upload de documentos integrado
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Acompanhamento Visual</CardTitle>
                                <CardDescription>
                                    Visualize seu progresso com gráficos intuitivos e relatórios detalhados em tempo real
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Segurança Total</CardTitle>
                                <CardDescription>
                                    Seus dados estão protegidos com criptografia avançada e backup automático
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Aprovação Eficiente</CardTitle>
                                <CardDescription>
                                    Coordenação pode revisar e aprovar solicitações com fluxo otimizado e notificações automáticas
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Gestão de Documentos</CardTitle>
                                <CardDescription>
                                    Organize e acesse todos os seus certificados e comprovantes em um local seguro
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-border/50 bg-card/50 backdrop-blur">
                            <CardHeader>
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <CardTitle>Colaboração Simples</CardTitle>
                                <CardDescription>
                                    Comunicação direta entre alunos e coordenação com histórico completo de interações
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            <footer className="bg-muted/50 border-t border-border/40 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold text-foreground">SAGHA</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            © 2025 SAGHA. Sistema de Acompanhamento e Gestão de Horas Acadêmicas.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}