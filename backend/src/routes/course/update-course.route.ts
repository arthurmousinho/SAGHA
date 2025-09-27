import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function updateCourseRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .put(
            '/course/:domain/:id',
            {
                schema: {
                    tags: ['courses'],
                    summary: 'Update a course',
                    params: z.object({
                        domain: z.string(),
                        id: z.string().cuid(),
                    }),
                    body: z.object({
                        name: z
                            .string('Nome deve ser uma string')
                            .min(5, { message: 'Nome deve ter pelo menos 5 caracteres' })
                            .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
                        description: z
                            .string('Descrição deve ser uma string')
                            .min(10, { message: 'Descrição deve ter pelo menos 10 caracteres' })
                            .max(500, { message: 'Descrição deve ter no máximo 500 caracteres' }),
                        durationInMonths: z
                            .number('Duração deve ser um número')
                            .min(1, { message: 'Duração deve ser no mínimo 1 mês' })
                            .max(60, { message: 'Duração deve ser no máximo 60 meses' }),
                    }),
                    response: {
                        201: z.object({
                            data: z.object({
                                id: z.string().cuid(),
                                name: z.string(),
                                description: z.string().nullable(),
                                durationInMonths: z.number(),
                                collegeId: z.string().cuid().nullable(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                            })
                        }),
                        400: z.object({ message: z.string() }),
                        404: z.object({ message: z.string() }),
                        409: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const { name, description, durationInMonths } = request.body;
                const { domain } = request.params;
                const { id } = request.params;

                const college = await prisma.college.findUnique({
                    where: { domain },
                });

                if (!college) {
                    return reply.status(404).send({ message: 'Faculdade não encontrada' });
                }

                const existingCourse = await prisma.course.findFirst({
                    where: { id },
                });

                if (!existingCourse) {
                    return reply.status(404).send({ message: 'Curso não encontrado' });
                }

                const updatedCourse = await prisma.course.update({
                    where: { id },
                    data: {
                        name,
                        description,
                        durationInMonths
                    },
                });

                return reply.status(201).send({
                    data: {
                        ...updatedCourse,
                        createdAt: updatedCourse.createdAt.toISOString(),
                        updatedAt: updatedCourse.updatedAt.toISOString(),
                    }
                });
            }
        )
}