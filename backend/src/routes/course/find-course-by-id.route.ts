import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function findCourseByIdRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get(
            '/course/:id',
            {
                schema: {
                    tags: ['courses'],
                    summary: 'Find a course by id',
                    params: z.object({
                        id: z.string().cuid(),
                    }),
                    response: {
                        200: z.object({
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
                    }
                }
            },
            async (request, reply) => {
                const { id } = request.params;

                const course = await prisma.course.findUnique({
                    where: { id },
                    include: {
                        semesters: true,
                    }
                });

                if (!course) {
                    return reply.status(404).send({ message: 'Curso não encontrado' });
                }

                return reply.status(200).send({
                    data: {
                        ...course,
                        createdAt: course.createdAt.toISOString(),
                        updatedAt: course.updatedAt.toISOString(),
                    }
                });
            }
        )

}