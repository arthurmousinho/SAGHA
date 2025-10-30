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
                    response: {
                        201: z.object({
                            data: z.object({
                                id: z.string().cuid(),
                                description: z.string(),
                                hoursRequested: z.number().int(),
                                startDate: z.string(),
                                endDate: z.string(),
                                status: z.string(),
                                createdAt: z.string(),
                                updatedAt: z.string(),
                            })
                        }),
                        400: z.object({ message: z.string() }),
                        404: z.object({ message: z.string() }),
                        500: z.object({ message: z.string() }),
                    }
                }
            },
            async (request, reply) => {
                try {
                    const data = await request.file();

                    if (!data) {
                        return reply.status(400).send({
                            message: 'Nenhum arquivo foi enviado'
                        });
                    }

                    const fields = data.fields;

                    const description = (fields.description as any)?.value;
                    const hoursRequested = parseInt((fields.hoursRequested as any)?.value);
                    const startDate = new Date((fields.startDate as any)?.value);
                    const endDate = new Date((fields.endDate as any)?.value);
                    const category = (fields.category as any)?.value;
                    const studentId = (fields.studentId as any)?.value;

                    if (!description || !hoursRequested || !startDate || !endDate || !category || !studentId) {
                        return reply.status(400).send({
                            message: 'Todos os campos são obrigatórios'
                        });
                    }

                    if (isNaN(hoursRequested)) {
                        return reply.status(400).send({
                            message: 'Horas solicitadas deve ser um número válido'
                        });
                    }

                    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                        return reply.status(400).send({
                            message: 'Datas inválidas'
                        });
                    }

                    const { domain } = request.params;

                    const isDateTimeGapValid = endDate.getTime() > startDate.getTime();

                    if (!isDateTimeGapValid) {
                        return reply.status(400).send({
                            message: 'Data de término deve ser depois que a data de início'
                        });
                    }

                    const collegeExistsForDomain = await prisma.college.findUnique({
                        where: { domain }
                    });

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
                    });

                    if (!studentExistsOnCollege) {
                        return reply.status(404).send({
                            message: 'Estudante não encontrado na faculdade informada'
                        });
                    }

                    // const currentHoursInCategory = await prisma.activity.aggregate({
                    //     _sum: {
                    //         hoursApproved: true
                    //     },
                    //     where: {
                    //         studentId,
                    //         category,
                    //         status: {
                    //             in: ['TOTALLY_APPROVED', 'PARTIALLY_APPROVED']
                    //         },
                    //     }
                    // });

                    // const requestedHours = (currentHoursInCategory._sum.hoursApproved || 0) + hoursRequested;
                    // const maxAllowedHours = categoryExistsOnCollege.maxHourTotal;

                    // if (requestedHours > maxAllowedHours) {
                    //     return reply.status(400).send({
                    //         message: `Número máximo de horas para a categoria ${categoryExistsOnCollege.name} excedido. Você já possui ${currentHoursInCategory._sum.hoursApproved || 0} horas aprovadas e o limite máximo é ${maxAllowedHours} horas.`,
                    //     });
                    // }

                    const fileId = createId();
                    let certificateUrl: any;
                    try {
                        certificateUrl = await uploadDataToCloudinary(
                            'certificates',
                            fileId,
                            data
                        );
                    } catch (error) {
                        console.error('Erro no upload:', error);
                        return reply.status(500).send({
                            message: 'Erro ao fazer upload do certificado'
                        });
                    }

                    const buffer = await data.toBuffer();

                    const newFile = await prisma.file.create({
                        data: {
                            id: fileId,
                            url: certificateUrl,
                            bucket: 'certificates',
                            name: data.filename,
                            sizeInBytes: buffer.length,
                            mimeType: data.mimetype,
                        }
                    });

                    const createActivity = await prisma.activity.create({
                        data: {
                            description,
                            hoursRequested,
                            startDate,
                            endDate,
                            category,
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

                } catch (error) {
                    console.error('Erro ao processar atividade:', error);
                    return reply.status(500).send({
                        message: 'Erro interno ao processar a requisição'
                    });
                }
            }
        );
}