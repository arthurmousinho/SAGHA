import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";
import bcrypt from "bcryptjs";

export function loginStudentOnCollegeRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/student/:domain/login",
            {
                schema: {
                    tags: ["students"],
                    summary: "Login student on college",
                    params: z.object({
                        domain: z.string(),
                    }),
                    body: z.object({
                        email: z
                            .string("O e-mail é obrigatório")
                            .email({ message: "E-mail inválido" }),
                        password: z
                            .string("A senha é obrigatória")
                            .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
                    }),
                    response: {
                        200: z.object({
                            token: z.string(),
                            user: z.object({
                                id: z.string().cuid(),
                                name: z.string(),
                                email: z.string().email(),
                            }),
                            student: z.object({
                                id: z.string().cuid(),
                                enrollment: z.string(),
                            }),
                            college: z.object({
                                id: z.string().cuid(),
                                name: z.string(),
                                domain: z.string(),
                            })
                        }),
                        401: z.object({ message: z.string() }),
                        404: z.object({ message: z.string() }),
                    },
                },
            },
            async (request, reply) => {
                const { domain } = request.params;
                const { email, password } = request.body;

                const college = await prisma.college.findUnique({
                    where: { domain }
                });

                if (!college) {
                    return reply.status(404).send({ message: "Faculdade não encontrada" });
                }

                const user = await prisma.user.findUnique({
                    where: { email },
                    include: {
                        student: true,
                        employee: true,
                    }
                });

                if (!user) {
                    return reply.status(401).send({ message: "Credenciais inválidas" });
                }

                if (user.password === null) {
                    return reply.status(401).send({ message: "Usuário não possui senha cadastrada" });
                }

                const student = await prisma.student.findFirst({
                    where: {
                        userId: user.id,
                        collegeId: college.id,
                    },
                });

                if (!student) {
                    return reply.status(401).send({ message: "Usuário não pertence à faculdade informada" });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return reply.status(401).send({ message: "Credenciais inválidas" });
                }

                const token = await reply.jwtSign(
                    {
                        sub: user.id,
                        studentId: student.id,
                        domain: college.domain
                    },
                    { expiresIn: "1d" }
                );

                return reply.status(200).send({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                    student: {
                        id: student.id,
                        enrollment: student.enrollment
                    },
                    college: {
                        id: college.id,
                        name: college.name,
                        domain: college.domain
                    },
                });
            }
        );
}