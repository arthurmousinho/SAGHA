import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function createActivityCategoryRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/activity/category',
            {
                schema: {
                    tags: ['activity-categories'],
                    summary: 'Create a new activity category',
                    body: z.object({
                        name: z.string().min(1).max(255),
                        description: z.string().max(1024),
                    }),
                    response: {
                        201: z.object({
                            data: z.object({
                                id: z.string().cuid(),
                                name: z.string(),
                                description: z.string(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                            })
                        }),
                        400: z.object({ message: z.string() }),
                        409: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const { name, description } = request.body;

                const categoryAlreadyExists = await prisma.activityCategory.findUnique({
                    where: { name }
                })

                if (categoryAlreadyExists) {
                    return reply.status(409).send({ message: 'Categoria de atividade já existe' });
                }

                const createNewCategory = await prisma.activityCategory.create({
                    data: {
                        name,
                        description,
                    }
                })

                return reply.status(201).send({
                    data: {
                        ...createNewCategory,
                        createdAt: createNewCategory.createdAt.toISOString(),
                        updatedAt: createNewCategory.updatedAt.toISOString(),
                    }
                });
            }
        )
}