import {paymentPlanSaveErrors, assignCourseErrors, publishErrors, assignIntakeErrors} from '@formError/headOfFinance'

export const Number_REGEX = /^\d+$/
export const Amount_REGEX = /^[0-9]*(\.[0-9]{0,2})?$/
// export const Percentage_REGEX = /^([1-9][0-9]?|100)$/
export const Percentage_REGEX = /^(?:100(?:\.0(?:0)?)?|\d{1,2}(?:\.\d{1,2})?)$/
export const Name_REGEX = /^[A-z ]+$/

export const paymentPlanSaveValidation = (planName, paymentInterval, intervalDays, editData) => {
    const error = {...paymentPlanSaveErrors}

    if (planName === null || planName.trim() === '') error.planName = true
    if (paymentInterval === '' && intervalDays.trim() === '') error.interval = true
    // if (editData.length === 0) error.editData = true
    if (editData.length !== 0) {
        let isValued = true
        editData.map(item => {
            for (const key in item) {
                if (item[key] === '') isValued = false
            }
        })
        if (!isValued) error.dataValues = true
    }

    return error
}

export const assignCourseValidation = (schemeName, schemeCode, awarding, desc) => {
    const error = {...assignCourseErrors}

    if (schemeName === null || schemeName.trim() === '') error.schemeName = true
    if (schemeCode === null || schemeCode.trim() === '') error.schemeCode = true
    // if (desc === null || desc.trim() === '') error.desc = true
    return error
}

export const publishValidation = (course, intake, paymentPlanLevel) => {
    const error = {...publishErrors}

    if (course.length === 0 && !paymentPlanLevel) error.course = true
    if (intake === null) error.intake = true
    return error
}

export const assignIntakeValidation = (intake) => {
    const error = {...assignIntakeErrors}

    if (intake.length === 0) error.intake = true
    return error
}