import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";

export function updateCollegeRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .put(
            '/college/:id',
            {
                schema: {
                    tags: ['colleges'],
                    summary: 'Update a college',
                    body: z.object({
                        name: z
                            .string('Nome deve ser uma string')
                            .min(5, { message: 'Nome deve ter pelo menos 5 caracteres' })
                            .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
                        address: z
                            .string('Endereço deve ser uma string')
                            .min(5, { message: 'Endereço deve ter pelo menos 5 caracteres' })
                            .max(100, { message: 'Endereço deve ter no máximo 100 caracteres' }),
                        city: z
                            .string('Cidade deve ser uma string')
                            .min(2, { message: 'Cidade deve ter pelo menos 2 caracteres' })
                            .max(100, { message: 'Cidade deve ter no máximo 100 caracteres' }),
                        state: z
                            .string('Estado deve ser uma string')
                            .min(2, { message: 'Estado deve ter pelo menos 2 caracteres' })
                            .max(100, { message: 'Estado deve ter no máximo 100 caracteres' }),
                        zipCode: z
                            .string('Código Postal deve ser uma string')
                            .min(5, { message: 'Código Postal deve ter pelo menos 5 caracteres' })
                            .max(10, { message: 'Código Postal deve ter no máximo 10 caracteres' }),
                        country: z
                            .string('País deve ser uma string')
                            .min(2, { message: 'País deve ter pelo menos 2 caracteres' })
                            .max(100, { message: 'País deve ter no máximo 100 caracteres' }),
                        phone: z
                            .string('Telefone deve ser uma string')
                            .min(10)
                            .max(15),
                        email: z
                            .string('Email deve ser uma string')
                            .email('Email inválido'),
                    }),
                    params: z.object({
                        id: z.string().cuid(),
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
                        409: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const { id } = request.params as { id: string };
                const newCollegeData = request.body;

                const college = await prisma.college.findUnique({
                    where: { id },
                })

                if (!college) {
                    return reply.status(404).send({ message: 'Faculdade não encontrada' });
                }

                const collegeWithSameEmail = await prisma.college.findUnique({
                    where: {
                        email: newCollegeData.email,
                        AND: { id: { not: id } }
                    },
                });

                if (collegeWithSameEmail) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com este email' });
                }

                const collegeWithZipCode = await prisma.college.findUnique({
                    where: {
                        zipCode: newCollegeData.zipCode,
                        AND: { id: { not: id } }
                    },
                });

                if (collegeWithZipCode) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com este código postal' });
                }

                const collegeWithPhone = await prisma.college.findUnique({
                    where: {
                        phone: newCollegeData.phone,
                        AND: { id: { not: id } }
                    },
                });

                if (collegeWithPhone) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com este telefone' });
                }

                const updatedCollege = await prisma.college.update({
                    where: { id },
                    data: {
                        ...newCollegeData,
                        updatedAt: new Date(),
                    },
                });

                return reply.status(200).send({ data: updatedCollege });
            }
        )

}
