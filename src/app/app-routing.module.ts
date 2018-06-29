import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DictionariesComponent } from '../eos-dictionaries/dictionaries/dictionaries.component';
import { DictionaryComponent } from '../eos-dictionaries/dictionary/dictionary.component';
import { CardComponent } from '../eos-dictionaries/card/card.component';
import { TestPageComponent } from './test-page/test-page.component';
import { DesktopComponent } from './desktop/desktop.component';

import { DeliveryComponent } from '../eos-rest/clman/delivery.component';
import { RubricComponent } from '../eos-rest/clman/rubric.component';
import { DepartmentComponent } from '../eos-rest/clman/department.component';
import { UserRestComponent } from '../eos-rest/clman/user.component';

import { CanDeactivateGuard } from './guards/can-deactivate.guard';
import { AuthorizedGuard, UnauthorizedGuard } from './guards/eos-auth.guard';
import { LoginComponent } from './login/login.component';

import { ParametersSystemComponent } from '../eos-parameters/parametersSystem/parametersSystem.component';
import { ParamWebComponent } from '../eos-parameters/parametersSystem/param-web/param-web.component';
import { ParamOtherComponent } from '../eos-parameters/parametersSystem/param-other/param-other.component';
import { ParamSearchComponent } from '../eos-parameters/parametersSystem/param-search/param-search.component';
import { ParamContextRcComponent } from 'eos-parameters/parametersSystem/param-context-rc/param-context-rc.component';
import { ParamAuthenticationComponent } from 'eos-parameters/parametersSystem/param-authentication/param-authentication.component';
import { ParamFielsComponent } from 'eos-parameters/parametersSystem/param-files/param-files.component';
import { ParamPrjRcComponent } from 'eos-parameters/parametersSystem/param-prj-rc/param-prj-rc.component';
import { ParamRcComponent } from 'eos-parameters/parametersSystem/param-rc/param-rc.component';
/// import { environment } from 'environments/environment';

const routes: Routes = [
    {
        path: 'spravochniki',
        data: { title: 'Справочники', showInBreadcrumb: true },
        canActivate: [AuthorizedGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: DictionariesComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: ':dictionaryId',
                data: {
                    title: 'Справочник',
                    showBreadcrumb: true,
                    showInBreadcrumb: true,
                    showSandwichInBreadcrumb: true,
                    showPushpin: true
                },
                children: [
                    {
                        path: ':nodeId',
                        data: { title: 'Запись', showInBreadcrumb: false },
                        children: [
                            {
                                path: '',
                                component: DictionaryComponent,
                                pathMatch: 'full',
                                data: { showBreadcrumb: true, showSandwichInBreadcrumb: true, showPushpin: true }
                            },
                            {
                                path: 'edit',
                                pathMatch: 'full',
                                component: CardComponent,
                                data: {
                                    title: 'Редактирование',
                                    showInBreadcrumb: false,
                                    showSandwichInBreadcrumb: false,
                                    showBreadcrumb: true,
                                    closeStyle: true,
                                    showPushpin: false
                                },
                                canDeactivate: [CanDeactivateGuard]
                            },
                            {
                                path: 'view',
                                pathMatch: 'full',
                                component: CardComponent,
                                data: {
                                    title: 'Просмотр',
                                    showInBreadcrumb: false,
                                    showSandwichInBreadcrumb: false,
                                    showBreadcrumb: true,
                                    closeStyle: true,
                                    showPushpin: false
                                }
                            }
                        ]
                    },
                    {
                        path: '',
                        component: DictionaryComponent,
                        pathMatch: 'full'
                    }
                ]
            }
        ]
    },
    {
        path: 'desk',
        data: { title: 'Главная', showInBreadcrumb: false },
        canActivate: [AuthorizedGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: DesktopComponent
            },
            {
                path: ':desktopId',
                component: DesktopComponent,
                data: { title: 'Главная', showInBreadcrumb: false, showBreadcrumb: false }
            }
        ]
    },
    {
        path: 'login',
        canActivate: [UnauthorizedGuard],
        component: LoginComponent,
        data: { title: 'Вход в систему', showInBreadcrumb: false }
    },
    {
        path: 'test',
        component: TestPageComponent,
        data: { title: 'Test page for UI components' }
    },
    {
        path: 'delivery',
        canActivate: [AuthorizedGuard],
        component: DeliveryComponent,
        data: { title: 'delivery page' }
    },
    {
        path: 'rubric',
        canActivate: [AuthorizedGuard],
        component: RubricComponent,
        data: { title: 'rubric page' }
    },
    {
        path: 'department',
        canActivate: [AuthorizedGuard],
        component: DepartmentComponent,
        data: { title: 'department page' }
    },
    {
        path: 'user',
        canActivate: [AuthorizedGuard],
        component: UserRestComponent,
        data: { title: 'user page' }
    },
    {
        path: 'parameters',
        canActivate: [AuthorizedGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: ParametersSystemComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'web',
                pathMatch: 'full',
                component: ParamWebComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'other',
                pathMatch: 'full',
                component: ParamOtherComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'search',
                pathMatch: 'full',
                component: ParamSearchComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'context-rc',
                pathMatch: 'full',
                component: ParamContextRcComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'authentication',
                pathMatch: 'full',
                component: ParamAuthenticationComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'files',
                pathMatch: 'full',
                component: ParamFielsComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'prj-rc',
                pathMatch: 'full',
                component: ParamPrjRcComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: 'rc',
                pathMatch: 'full',
                component: ParamRcComponent,
                canActivate: [AuthorizedGuard]
            },
            {
                path: '**',
                component: ParametersSystemComponent,
                canActivate: [AuthorizedGuard]
            }
        ]
    },
    {
        path: '',
        redirectTo: '/desk/system',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/desk/system',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
