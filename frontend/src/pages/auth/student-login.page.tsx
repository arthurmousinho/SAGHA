import { Clock, FileText, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react";

export function StudentLoginPage() {

    const [loginError, _] = useState("");
    const [isLoading, __] = useState(false);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4" >
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground font-[family-name:var(--font-heading)]">SAGHA</h1>
                                <p className="text-muted-foreground">Sistema de Acompanhamento e Gestão de Horas Acadêmicas</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold text-foreground font-[family-name:var(--font-heading)]">
                            Gerencie suas horas acadêmicas de forma simples e eficiente
                        </h2>

                        <div className="grid gap-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Controle Total</h3>
                                    <p className="text-sm text-muted-foreground">Acompanhe suas horas acadêmicas em tempo real</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Solicitações Fáceis</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Envie documentos e faça solicitações com poucos cliques
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-4 h-4 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">Aprovação Rápida</h3>
                                    <p className="text-sm text-muted-foreground">Processo de aprovação otimizado pela coordenação</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-[family-name:var(--font-heading)]">Acesse sua conta</CardTitle>
                        <CardDescription>Entre com suas credenciais para continuar</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="student-email">Email</Label>
                                <Input
                                    id="student-email"
                                    name="email"
                                    type="email"
                                    placeholder="seu.email@universidade.edu.br"
                                    defaultValue="joao.silva@universidade.edu.br"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="student-password">Senha</Label>
                                <Input
                                    id="student-password"
                                    name="password"
                                    type="password"
                                    placeholder="Digite qualquer senha"
                                    required
                                />
                            </div>
                            {loginError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{loginError}</AlertDescription>
                                </Alert>
                            )}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Entrando..." : "Entrar como Aluno"}
                            </Button>
                        </form>

                        <div className="mt-4 text-center">
                            <a href="#" className="text-sm text-primary hover:underline">
                                Esqueceu sua senha?
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )

}