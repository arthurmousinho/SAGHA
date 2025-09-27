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
import { createCollegeRoute } from "./routes/college/create-college.route";
import { updateCollegeRoute } from "./routes/college/update-college.route";
import { findCollegeByDomainRoute } from "./routes/college/find-college-by-domain.route";
import { registerStudentOnCollegeRoute } from "./routes/college/register-student-on-college.route";
import { createCourseRoute } from "./routes/course/create-course.route";
import { updateCourseRoute } from "./routes/course/update-course.route";
import { findCourseByIdRoute } from "./routes/course/find-course-by-id.route";
import { createSemesterRoute } from "./routes/semester/create-semester.route";

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

// College routes
app.register(createCollegeRoute);
app.register(updateCollegeRoute);
app.register(findCollegeByDomainRoute);
app.register(registerStudentOnCollegeRoute);

// Course routes
app.register(createCourseRoute);
app.register(updateCourseRoute);
app.register(findCourseByIdRoute);

// Semester routes
app.register(createSemesterRoute);

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