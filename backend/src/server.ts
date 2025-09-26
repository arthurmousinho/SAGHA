import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider
} from "fastify-type-provider-zod";
import z from "zod";
import { createCollegeRoute } from "./routes/college/college.route";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
    openapi: {
        info: {
            title: 'API SAGHA',
            description: 'Documentação da API do projeto SAGHA - Sistema de Acompanhamento e Gestão de Horas Acadêmicas',
            version: '1.0.0',
        },
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
});

app.register(createCollegeRoute)

app.after(() => {
    app.withTypeProvider<ZodTypeProvider>().get('/', {
        schema: {
            response: {
                200: z.object({
                    message: z.string(),
                }),
            },
        },
    }, async (request, reply) => {
        return reply.send({ message: 'Hello world!' })
    });
})

app
    .listen({ port: 3333 })
    .then(() => console.log('✅ Server running on http://localhost:3333. You can access the docs at http://localhost:3333/docs'))