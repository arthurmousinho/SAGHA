import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function createSemesterRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/semester/:domain',
            {
                schema: {
                    tags: ['semesters'],
                    summary: 'Create a new semester',
                    params: z.object({
                        domain: z.string(),
                    }),
                    body: z.object({
                        name: z
                            .string("O nome é obrigatório")
                            .min(3, { message: "O nome deve ter no mínimo 3 caracteres" })
                            .max(100, { message: "O nome deve ter no máximo 100 caracteres" }),
                        durationInMonths: z
                            .number("A duração em meses é obrigatória")
                            .min(1, { message: "A duração mínima é de 1 mês" })
                            .max(6, { message: "A duração máxima é de 6 meses" }),
                        courseId: z
                            .string("O curso é obrigatório")
                            .cuid({ message: "O identificador do curso deve ser um CUID válido" }),
                    }),
                    response: {
                        201: z.object({
                            data: z.object({
                                id: z.string().cuid(),
                                name: z.string(),
                                durationInMonths: z.number(),
                                courseId: z.string().cuid().nullable(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                            })
                        }),
                        404: z.object({ message: z.string() }),
                        409: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const { domain } = request.params;
                const { name, durationInMonths, courseId } = request.body;

                const college = await prisma.college.findUnique({
                    where: { domain },
                });

                if (!college) {
                    return reply.status(404).send({ message: 'Faculdade não encontrada' });
                }

                const course = await prisma.course.findUnique({
                    where: { id: courseId },
                });

                if (!course) {
                    return reply.status(404).send({ message: 'Curso não encontrado' });
                }

                if (course.collegeId !== college.id) {
                    return reply.status(409).send({ message: 'O curso não pertence à faculdade informada' });
                }

                const existingSemester = await prisma.semester.findFirst({
                    where: {
                        name,
                        courseId,
                    },
                });

                if (existingSemester) {
                    return reply.status(409).send({ message: 'Já existe um semestre com esse nome neste curso' });
                }

                const newSemester = await prisma.semester.create({
                    data: {
                        name,
                        durationInMonths,
                        courseId,
                    },
                });

                return reply.status(201).send({
                    data: {
                        ...newSemester,
                        createdAt: newSemester.createdAt.toISOString(),
                        updatedAt: newSemester.updatedAt.toISOString(),
                    }
                });
            }
        )
}