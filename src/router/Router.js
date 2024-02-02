// ** React Imports
import React, {Fragment, lazy, Suspense, useEffect} from 'react'

// ** Utils
import {useLayout} from '@hooks/useLayout'
import {useRouterTransition} from '@hooks/useRouterTransition'

// ** Custom Components
import LayoutWrapper from '@layouts/components/layout-wrapper'

// ** Router Components
import {BrowserRouter as AppRouter, Redirect, Route, Switch} from 'react-router-dom'

// ** Routes & Default Routes
import {RoutesHeadOfCounselor, DefaultRouteHeadOfCounselor} from './routes/counselor'
import {RoutesStudent, DefaultRouteStudent} from './routes/student'
import {DefaultRouteHAA, RoutesHAA} from './routes/headOfAcademicAdmin'
import {RoutesHeadOfFinance, DefaultRouteHeadOfFinance} from './routes/headOfFinance'
import {DefaultRouteLecturer, RoutesLecturer} from './routes/lecturer'
import {Common, DefaultRoutes} from './routes/common'

import config from '@storage'

// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'

import Cookies from "js-cookie"

const Router = () => {

    // ** Hooks
    const {layout, setLayout, setLastLayout} = useLayout()
    const {transition, setTransition} = useRouterTransition()

    // ** Default Layout
    const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout'

    // ** All of the available layouts
    const Layouts = {BlankLayout, VerticalLayout, HorizontalLayout}

    // ** Current Active Item
    const currentActiveItem = null

    // ** Return Filtered Array of Routes & Paths
    const LayoutRoutesAndPaths = layout => {
        const LayoutRoutes = []
        const LayoutPaths = []

        let roleRoutes = []
        const userRole = Cookies.get(config.role)

        if (userRole) {
            switch (userRole) {
                case config.hocRole:
                    roleRoutes = RoutesHeadOfCounselor
                    break
                case config.hofRole:
                    roleRoutes = RoutesHeadOfFinance
                    break
                case config.studentRole:
                    roleRoutes = RoutesStudent
                    break
                case config.haaRole:
                    roleRoutes = RoutesHAA
                    break
                case config.lecturer:
                    roleRoutes = RoutesLecturer
                    break
            }
        }

        let rts = Common
        if (roleRoutes) {
            rts = [...roleRoutes, ...Common]
        }
        rts.filter(route => {
            if (route.layout === layout || (route.layout === undefined && DefaultLayout === layout)) {
                LayoutRoutes.push(route)
                LayoutPaths.push(route.path)
            }
        })

        return {LayoutRoutes, LayoutPaths}
    }

    // ** Init Error Component
    const Error = lazy(() => import('@src/views/Error'))
    const Login = lazy(() => import('@src/views/Login'))

    /**
     ** Final Route Component Checks for Login & User Role and then redirects to the route
     */
    const FinalRoute = () => {
        const userRole = Cookies.get(config.role)
        if (userRole) {
            switch (userRole) {
                case config.hocRole:
                    return <Redirect to={DefaultRouteHeadOfCounselor}/>
                case config.hofRole:
                    return <Redirect to={DefaultRouteHeadOfFinance}/>
                case config.studentRole:
                    return <Redirect to={DefaultRouteStudent}/>
                case config.haaRole:
                    return <Redirect to={DefaultRouteHAA}/>
                case config.lecturer:
                    return <Redirect to={DefaultRouteLecturer}/>
            }
        } else {
            return <Redirect to={DefaultRoutes}/>
        }
    }

    // ** Return Route to Render
    const ResolveRoutes = () => {
        return Object.keys(Layouts).map((layout, index) => {
            // ** Convert Layout parameter to Layout Component
            // ? Note: make sure to keep layout and component name equal

            const LayoutTag = Layouts[layout]

            // ** Get Routes and Paths of the Layout
            const {LayoutRoutes, LayoutPaths} = LayoutRoutesAndPaths(layout)

            // ** We have freedom to display different layout for different route
            // ** We have made LayoutTag dynamic based on layout, we can also replace it with the only layout component,
            // ** that we want to implement like VerticalLayout or HorizontalLayout
            // ** We segregated all the routes based on the layouts and Resolved all those routes inside layouts

            // ** RouterProps to pass them to Layouts
            const routerProps = {}

            return (
                <Route path={LayoutPaths} key={index}>
                    <LayoutTag
                        layout={layout}
                        setLayout={setLayout}
                        transition={transition}
                        routerProps={routerProps}
                        setLastLayout={setLastLayout}
                        setTransition={setTransition}
                        currentActiveItem={currentActiveItem}
                    >
                        <Switch>
                            {LayoutRoutes.map(route => {
                                return (
                                    <Route
                                        key={route.path}
                                        path={route.path}
                                        exact={route.exact === true}
                                        render={props => {
                                            // ** Assign props to routerProps
                                            Object.assign(routerProps, {
                                                ...props,
                                                meta: route.meta
                                            })

                                            return (
                                                <Fragment>
                                                    {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}

                                                    {route.layout === 'BlankLayout' ? (
                                                        <Fragment>
                                                            <route.component {...props} />
                                                        </Fragment>
                                                    ) : (
                                                        <LayoutWrapper
                                                            layout={DefaultLayout}
                                                            transition={transition}
                                                            setTransition={setTransition}
                                                            /* Conditional props */
                                                            /*eslint-disable */
                                                            {...(route.appLayout
                                                                ? {
                                                                    appLayout: route.appLayout
                                                                }
                                                                : {})}
                                                            {...(route.meta
                                                                ? {
                                                                    routeMeta: route.meta
                                                                }
                                                                : {})}
                                                            {...(route.className
                                                                ? {
                                                                    wrapperClass: route.className
                                                                }
                                                                : {})}
                                                            /*eslint-enable */
                                                        >
                                                            <Suspense fallback={null}>
                                                                <route.component {...props} />
                                                            </Suspense>
                                                        </LayoutWrapper>
                                                    )}
                                                </Fragment>
                                            )
                                        }}
                                    />
                                )
                            })}
                        </Switch>
                    </LayoutTag>
                </Route>
            )
        })
    }

    return (
        <AppRouter basename={process.env.REACT_APP_BASENAME}>
            <Switch>
                {/* If user is logged in Redirect user to DefaultRoute else to login */}
                <Route
                    exact
                    path='/'
                    render={FinalRoute}
                />
                {ResolveRoutes()}

                {/* NotFound Error page */}
                <Route path='*' component={Login}/>
            </Switch>
        </AppRouter>
    )
}

export default Router
