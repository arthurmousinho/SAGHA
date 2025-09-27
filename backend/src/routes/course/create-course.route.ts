import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function createCourseRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/course/:domain',
            {
                schema: {
                    tags: ['courses'],
                    summary: 'Create a new course',
                    params: z.object({
                        domain: z.string(),
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
                        404: z.object({ message: z.string() }),
                        409: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const { name, description, durationInMonths } = request.body;
                const { domain } = request.params;

                const college = await prisma.college.findUnique({
                    where: { domain },
                });

                if (!college) {
                    return reply.status(404).send({ message: 'Faculdade não encontrada' });
                }

                const existingCourse = await prisma.course.findFirst({
                    where: {
                        name,
                        collegeId: college.id,
                    },
                });

                if (existingCourse) {
                    return reply.status(409).send({ message: 'Já existe um curso com esse nome nesta faculdade' });
                }

                const newCourse = await prisma.course.create({
                    data: {
                        name,
                        description,
                        durationInMonths,
                        collegeId: college.id,
                    },
                });

                return reply.status(201).send({
                    data: {
                        ...newCourse,
                        createdAt: newCourse.createdAt.toISOString(),
                        updatedAt: newCourse.updatedAt.toISOString(),
                    }
                });
            }
        )
}