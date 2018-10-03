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
import { UserParamsComponent } from 'eos-user-params/eos-user-params.component';
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
                path: ':id',
                pathMatch: 'full',
                component: ParametersSystemComponent,
                canDeactivate: [CanDeactivateGuard],
                data: {
                    showNav: true
                }
            },
            {
                path: '',
                redirectTo: 'rc',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: 'user-params-set',
        canActivate: [AuthorizedGuard],
        children: [
            {
                path: ':field-id',
                children: [
                    {
                        path: ':sub-field',
                        component: UserParamsComponent
                    },
                    {
                        path: '',
                        pathMatch: 'full',
                        component: UserParamsComponent
                    }
                ]
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'param-set',
            },
        ]
    },
    {
        path: 'user_param',
        data: {
            title: 'Пользователи',
            showBreadcrumb: true,
            showInBreadcrumb: true,
            showSandwichInBreadcrumb: true,
            showPushpin: true
        },
        canActivate: [AuthorizedGuard],
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
                    }
                ]
            },
            {
                path: '',
                component: DictionaryComponent,
                pathMatch: 'full'
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
