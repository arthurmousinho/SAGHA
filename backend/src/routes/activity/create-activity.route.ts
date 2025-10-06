import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../../db/prisma";
import { createId } from "@paralleldrive/cuid2";
import { uploadDataToCloudinary } from "../../storage/cloudnary-storage.service";

export function createActivityRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post(
            '/activity/:domain',
            {
                schema: {
                    tags: ['activity'],
                    summary: 'Create a new activity',
                    params: z.object({
                        domain: z.string().min(1).max(255),
                    }),
                    body: z.object({
                        description: z.string().max(1024),
                        hoursRequested: z.number().int(),
                        startDate: z.date(),
                        endDate: z.date(),
                        categoryId: z.string().cuid(),
                        studentId: z.string().cuid(),
                        certificateFile: z.file()
                    }),
                    response: {
                        // 201: z.object({
                        //     data: z.object({
                        //         id: z.string().cuid(),
                        //         description: z.string(),
                        //         hoursRequested: z.number().int(),
                        //         startDate: z.string(),
                        //         endDate: z.string(),

                        //     })
                        // }),
                        // 400: z.object({ message: z.string() }),
                        // 409: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                const {
                    description,
                    hoursRequested,
                    startDate,
                    endDate,
                    categoryId,
                    studentId,
                    certificateFile
                } = request.body;

                const { domain } = request.params;

                const isDateTimeGapValid = endDate.getTime() > startDate.getTime();

                if (!isDateTimeGapValid) {
                    return reply.status(400).send({
                        message: 'Data de término deve ser depois que a data de início'
                    });
                }

                const collegeExistsForDomain = await prisma.college.findUnique({
                    where: { domain }
                })

                if (!collegeExistsForDomain) {
                    return reply.status(404).send({
                        message: 'Faculdade não encontrada para o domínio informado'
                    });
                }

                const studentExistsOnCollege = await prisma.student.findUnique({
                    where: {
                        id: studentId,
                        college: {
                            domain
                        }
                    }
                })

                if (!studentExistsOnCollege) {
                    return reply.status(404).send({
                        message: 'Estudante não encontrado na faculdade informada'
                    });
                }

                const categoryExistsOnCollege = await prisma.activityCategory.findUnique({
                    where: {
                        id: categoryId,
                        activities: {
                            some: {
                                student: {
                                    college: {
                                        domain
                                    }
                                }
                            }
                        }
                    }
                })

                if (!categoryExistsOnCollege) {
                    return reply.status(404).send({
                        message: 'Categoria de atividade não encontrada na faculdade informada'
                    });
                }

                const currentHoursInCategory = await prisma.activity.aggregate({
                    _sum: {
                        hoursApproved: true
                    },
                    where: {
                        studentId,
                        categoryId,
                        status: {
                            in: ['TOTALLY_APPROVED', 'PARTIALLY_APPROVED']
                        },
                    }
                });

                const requestedHours = (currentHoursInCategory._sum.hoursApproved || 0) + hoursRequested;
                const maxAllowedHours = categoryExistsOnCollege.maxHourTotal;

                if (requestedHours > maxAllowedHours) {
                    return reply.status(400).send({
                        message: `Número máximo de horas para a categoria ${categoryExistsOnCollege.name} excedido. Você já possui ${currentHoursInCategory._sum.hoursApproved || 0} horas aprovadas e o limite máximo é ${maxAllowedHours} horas.`,
                    });
                }

                // TODO: Verificar horas máximas da categoria por semestre

                const fileId = createId();
                let certificateUrl;
                try {
                    certificateUrl = await uploadDataToCloudinary(
                        'certificates',
                        fileId,
                        certificateFile
                    )
                } catch (error) {
                    reply.status(500).send({ message: 'Erro ao fazer upload do certificado' });
                }

                const newFile = await prisma.file.create({
                    data: {
                        id: fileId,
                        url: String(certificateUrl),
                        bucket: 'certificates',
                        name: certificateFile.name,
                        sizeInBytes: certificateFile.size,
                        mimeType: certificateFile.type,
                    }
                })

                const createActivity = await prisma.activity.create({
                    data: {
                        description,
                        hoursRequested,
                        startDate,
                        endDate,
                        categoryId,
                        studentId,
                        employeeId: null,
                        certificateId: newFile.id,
                        status: 'IN_ANALYSIS',
                    }
                });

                return reply.status(201).send({
                    data: {
                        ...createActivity,
                        startDate: createActivity.startDate.toISOString(),
                        endDate: createActivity.endDate.toISOString(),
                        createdAt: createActivity.createdAt.toISOString(),
                        updatedAt: createActivity.updatedAt.toISOString()
                    }
                });

            }
        )
}