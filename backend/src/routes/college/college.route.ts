import { error } from "console";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z, { object } from "zod";
import { prisma } from "../../db/prisma";

export function createCollegeRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/college',
            {
                schema: {
                    tags: ['colleges'],
                    summary: 'Create a new college',
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
                        domain: z
                            .string('Domínio deve ser uma string')
                            .min(3, 'Domínio deve ter pelo menos 3 caracteres')
                            .max(20, 'Domínio deve ter no máximo 20 caracteres'),
                    }),
                    response: {
                        201: z.object({
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
                                createdAt: z.string().datetime(),
                                updatedAt: z.string().datetime()
                            })
                        }),
                        409: z.object({
                            message: z.string(),
                        }),
                    }
                }
            },
            async (request, reply) => {
                const createCollegeData = request.body;

                const collegeAlreadyExistsWithDomain = await prisma.college.findUnique({
                    where: {
                        domain: createCollegeData.domain
                    }
                })

                if (collegeAlreadyExistsWithDomain) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com esse domínio.' })
                }

                const collegeAlreadyExistsWithEmail = await prisma.college.findUnique({
                    where: {
                        email: createCollegeData.email
                    }
                })

                if (collegeAlreadyExistsWithEmail) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com esse email.' })
                }

                const collegeAlreadyExistsWithZipCode = await prisma.college.findUnique({
                    where: {
                        zipCode: createCollegeData.zipCode
                    }
                })

                if (collegeAlreadyExistsWithZipCode) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com esse código postal.' })
                }

                const collegeAlreadyExistsWithPhone = await prisma.college.findUnique({
                    where: {
                        phone: createCollegeData.phone
                    }
                })

                if (collegeAlreadyExistsWithPhone) {
                    return reply.status(409).send({ message: 'Já existe uma faculdade com esse telefone.' })
                }

                const college = await prisma.college.create({
                    data: createCollegeData
                })

                return reply.status(201).send({
                    data: {
                        ...college,
                        createdAt: college.createdAt.toISOString(),
                        updatedAt: college.updatedAt.toISOString()
                    }
                })
            }
        )

}
