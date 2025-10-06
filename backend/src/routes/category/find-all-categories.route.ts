import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../db/prisma";

export function findAllActivitiesCategoryRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get(
            '/activity/category',
            {
                schema: {
                    tags: ['activity-categories'],
                    summary: 'Get all activity categories',
                }
            },
            async (request, reply) => {
                const findAllCategories = await prisma.activityCategory.findMany();

                return reply.send({
                    data: findAllCategories.map(category => ({
                        ...category,
                        createdAt: category.createdAt.toISOString(),
                        updatedAt: category.updatedAt.toISOString(),
                    }))
                });
            }
        )
}