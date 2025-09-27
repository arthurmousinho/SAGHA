import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function registerStudentOnCollegeRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            "/college/student/:domain",
            {
                schema: {
                    tags: ["colleges"],
                    summary: "Registrar um estudante em uma faculdade",
                    params: z.object({
                        domain: z.string(),
                    }),
                    body: z.object({
                        name: z
                            .string("O nome é obrigatório")
                            .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
                            .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
                        email: z
                            .string("O e-mail é obrigatório")
                            .email({ message: "O e-mail informado não é válido" }),
                        enrollment: z
                            .string("A matrícula é obrigatória")
                            .min(1, { message: "A matrícula não pode ser vazia" })
                            .max(20, { message: "A matrícula deve ter no máximo 20 caracteres" }),
                        semesterId: z
                            .string("O semestre é obrigatório")
                            .cuid({ message: "O semestre informado não é um CUID válido" }),
                        courseId: z
                            .string("O curso é obrigatório")
                            .cuid({ message: "O curso informado não é um CUID válido" }),
                    }),
                    response: {
                        201: z.object({
                            data: z.object({
                                id: z.string().cuid(),
                                enrollment: z.string(),
                                semesterId: z.string().cuid(),
                                courseId: z.string().cuid(),
                                collegeId: z.string().cuid(),
                                userId: z.string().cuid(),
                                createdAt: z.date(),
                                updatedAt: z.date(),
                            }),
                        }),
                        409: z.object({ message: z.string() }),
                        404: z.object({ message: z.string() }),
                    },
                },
            },
            async (request, reply) => {
                const { domain } = request.params;
                const { name, email, enrollment, semesterId, courseId } = request.body;

                const college = await prisma.college.findUnique({
                    where: { domain },
                });

                if (!college) {
                    return reply.status(404).send({ message: "Faculdade não encontrada" });
                }

                let user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user) {
                    user = await prisma.user.create({
                        data: { name, email },
                    });
                }

                const existingStudent = await prisma.student.findFirst({
                    where: {
                        collegeId: college.id,
                        OR: [{ enrollment }, { userId: user.id }],
                    },
                });

                if (existingStudent) {
                    return reply.status(409).send({
                        message: "Aluno já cadastrado nessa faculdade",
                    });
                }

                const newStudent = await prisma.student.create({
                    data: {
                        enrollment,
                        collegeId: college.id,
                        userId: user.id,
                        semesterId,
                        courseId,
                    },
                });

                return reply.status(201).send({ data: newStudent });
            }
        );
}