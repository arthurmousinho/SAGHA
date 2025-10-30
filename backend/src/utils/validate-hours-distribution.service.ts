function isSemesterValid(data: {
    studentSemesterHours: number,
    studentRequestedHours: number,
}) {
    const { studentSemesterHours, studentRequestedHours } = data;

    let hoursApproved;
    if (studentRequestedHours + studentSemesterHours > 72) {
        return false
    }

    return true
}

function isMaxHoursExceeded(data: {
    studentTotalHours: number,
    studentRequestedHours: number,
}) {

    const { studentTotalHours, studentRequestedHours } = data;

    if (studentRequestedHours + studentTotalHours > 120) {
        return true
    }

    return false
}


export function validateHoursDistributionForExtension(data: {
    studentTotalHours: number,
    studentSemesterHours: number,
    studentRequestedHours: number,
}) {

    const { studentTotalHours, studentSemesterHours, studentRequestedHours } = data;

    if (isMaxHoursExceeded({ studentTotalHours, studentRequestedHours })) {
        return {
            success: false,
            message: 'A quantidade de horas solicitadas para Extensão excedem o limite máximo permitido para o curso. (120)'
        }
    }


    if (!isSemesterValid({ studentSemesterHours, studentRequestedHours })) {
        return {
            success: false,
            message: 'A quantidade de horas solicitadas para Extensão excede o limite máximo permitido para o semestre.'
        }
    }

    return {
        success: true,
        message: 'Horas válidas para atividades de Extensão.'
    }
}

export function validateHoursDistributionForTeaching(data: {
    studentTotalHours: number,
    studentSemesterHours: number,
    studentRequestedHours: number,
}) {

    const { studentTotalHours, studentSemesterHours, studentRequestedHours } = data;

    if (isMaxHoursExceeded({ studentTotalHours, studentRequestedHours })) {
        return {
            success: false,
            message: 'A quantidade de horas solicitadas para Ensino excedem o limite máximo permitido para o curso. (120 horas)'
        }
    }


    if (!isSemesterValid({ studentSemesterHours, studentRequestedHours })) {
        return {
            success: false,
            message: 'A quantidade de horas solicitadas para Ensino excede o limite máximo permitido para o semestre. (72 horas)'
        }
    }

    return {
        success: true,
        message: 'Horas válidas para atividades de Ensino.'
    }
}
