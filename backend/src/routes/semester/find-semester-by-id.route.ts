import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function findSemesterByIdRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get(
            '/semester/:domain/:semesterId',
            {
                schema: {
                    tags: ['semesters'],
                    summary: 'Find a semester by ID',
                    params: z.object({
                        domain: z.string(),
                        semesterId: z.string().cuid({ message: "O ID do semestre deve ser um CUID válido" }),
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

                // Verifica se a faculdade existe
                const college = await prisma.college.findUnique({ where: { domain } });
                if (!college) {
                    return reply.status(404).send({ message: 'Faculdade não encontrada' });
                }

                // Busca o semestre
                const semester = await prisma.semester.findUnique({
                    where: { id: semesterId },
                    include: { course: true },
                });

                if (!semester) {
                    return reply.status(404).send({ message: 'Semestre não encontrado' });
                }

                // Verifica se o semestre pertence à faculdade
                if (semester.course?.collegeId !== college.id) {
                    return reply.status(409).send({ message: 'O semestre não pertence à faculdade informada' });
                }

                return reply.status(200).send({
                    data: {
                        ...semester,
                        createdAt: semester.createdAt.toISOString(),
                        updatedAt: semester.updatedAt.toISOString(),
                    }
                });
            }
        );
}
