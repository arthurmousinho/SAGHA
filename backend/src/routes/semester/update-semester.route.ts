import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function updateSemesterRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .put(
            '/semester/:domain/:semesterId',
            {
                schema: {
                    tags: ['semesters'],
                    summary: 'Update an existing semester',
                    params: z.object({
                        domain: z.string(),
                        semesterId: z.string().cuid({ message: "O ID do semestre deve ser um CUID válido" }),
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
                    }),
                    response: {
                        200: z.object({
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
                const { domain, semesterId } = request.params;
                const { name, durationInMonths } = request.body;

                const college = await prisma.college.findUnique(
                    { where: { domain } }
                );

                if (!college) {
                    return reply.status(404).send({ message: 'Faculdade não encontrada' });
                }

                const semester = await prisma.semester.findUnique({
                    where: { id: semesterId },
                    include: { course: true }
                });

                if (!semester) {
                    return reply.status(404).send({ message: 'Semestre não encontrado' });
                }

                if (semester.course?.collegeId !== college.id) {
                    return reply.status(409).send({ message: 'O semestre não pertence à faculdade informada' });
                }

                const existingSemester = await prisma.semester.findFirst({
                    where: {
                        name,
                        courseId: semester.courseId,
                        NOT: { id: semesterId }
                    }
                });

                if (existingSemester) {
                    return reply.status(409).send({ message: 'Já existe um semestre com esse nome neste curso' });
                }

                const updatedSemester = await prisma.semester.update({
                    where: { id: semesterId },
                    data: { name, durationInMonths },
                });

                return reply.status(200).send({
                    data: {
                        ...updatedSemester,
                        createdAt: updatedSemester.createdAt.toISOString(),
                        updatedAt: updatedSemester.updatedAt.toISOString(),
                    }
                });
            }
        );
}