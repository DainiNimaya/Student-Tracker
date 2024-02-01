import * as programmeService from '@service/programmeService'
import {toast} from "react-toastify"

export const getAllProgramme = async (name, page, size) => {
    let body = []
    // await programmeService.getAllProgramme(name, page, size)
    //     .then(res => {
    //         if (res.status === 0) {
    //             if (res.body) {
                    body = {
                        content:[
                            {programmeId:'1', name:'Engineering Programmes', desc: 'It encompasses a wide range of disciplines such as civil, mechanical, electrical, chemical, and computer engineering, among others.'},
                            {programmeId:'2',name:'Business Programmes', desc: 'It covers key areas such as finance, marketing, accounting, human resources, and entrepreneurship.'},
                            {programmeId:'3',name:'IT Programmes', desc: 'Students learn how to design, implement, and manage technology solutions to address organizational needs and challenges.'},
                            {programmeId:'4',name:'Accountancy Programmes', desc: 'An accountancy program is designed to provide students with a comprehensive understanding of financial principles, practices, and regulations. '},
                            {programmeId:'5',name:'Master of Business Administration', desc: 'A Master of Business Administration (MBA) program is a graduate-level degree that provides students with advanced knowledge and skills in various aspects of business management and leadership'}
                        ],
                        totalElements:5,
                        totalPages:1,
                        numberOfElements:5,
                        pageable:{offset:0}
                    }
        //         }
        //     }
        // })
    return body
}

export const createEditProgramme = async (data) => {

    const requiredData = {}
    requiredData.programmeId = data.programmeId === null ? 0 : data.programmeId
    requiredData.programmeName = data.programmeName
    requiredData.programmeDescription = data.description

    let body = 1
    await programmeService.createEditProgramme(requiredData, data.programmeId)
        .then(res => {
            if (res !== undefined) {
                if (res.status === 0) {
                    toast.success(data.courseId === null ? "Programme added successfully." : "Programme details updated successfully", {
                        icon: true,
                        hideProgressBar: true
                    })
                    body = res.status
                }
            }
        })
    return body

}