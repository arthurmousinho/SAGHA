import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function findCollegeByDomainRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get(
            '/college/:domain',
            {
                schema: {
                    tags: ['colleges'],
                    summary: 'Find a college by domain',
                    params: z.object({
                        domain: z.string(),
                    }),
                    response: {
                        200: z.object({
                            data: z.object({
                                id: z.string().cuid(),
                                name: z.string(),
                                address: z.string(),
                                city: z.string(),
                                state: z.string(),
                                zipCode: z.string(),
                                country: z.string(),
                                phone: z.string(),
                                email: z.string().email(),
                                domain: z.string(),
                                createdAt: z.date(),
                                updatedAt: z.date(),
                            }),
                        }),
                        404: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const { domain } = request.params;

                const college = await prisma.college.findUnique({
                    where: { domain }
                });

                if (!college) {
                    return reply.status(404).send({ message: 'College not found' });
                }

                return reply.status(200).send({ data: college });
            }
        )

}