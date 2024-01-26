import React, {useEffect} from 'react'
import '@styles/react/pages/page-authentication.scss'
import {LOGIN_TYPES} from "@const"
import DefaultLogin from "./login/defaultLogin"
import {login} from '@strings'
import './styles.scss'


const LoginCover = () => {


    useEffect(() => {

    }, [])

    return (<>
            <DefaultLogin/>
        </>
    )
}


export default LoginCover
