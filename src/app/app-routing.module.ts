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
import { UserSelectComponent } from 'eos-user-select/eos-user-select.component';
import { PermissionsGuard } from './guards/permissions.guard';
import { EosTemplateComponent } from 'eos-rest/clman/eos-template/eos-template.component';

import { DictFormComponent } from 'eos-dictionaries/dict-forms/dict-form.component';
import { EosReportUsersStatsComponent } from 'eos-user-params/report/users-stats/users-stats.component';
import { EosReportSummaryProtocolComponent } from 'eos-user-params/report/sum-protocol/sum-protocol.component';
import { DefaultSettingsComponent } from 'eos-user-params/default-options/default-settings.component';
import { CurrentUserSetComponent } from 'eos-user-params/current-user-set/current-user-set.component';
/// import { environment } from 'environments/environment';

const formDictionariesComponent = [
    {
        path: ':dictionaryId',
        canDeactivate: [CanDeactivateGuard],
        component: DictFormComponent,
    },
    {
        path: '',
        redirectTo: '/spravochniki',
        pathMatch: 'full'
    }
];
const childrenDictionariesComponent = [{
    path: '',
    pathMatch: 'full',
    component: DictionariesComponent,
    canActivate: [AuthorizedGuard],
}, {
    path: ':dictionaryId',
    data: {
        title: 'Справочник', showBreadcrumb: true,
        showInBreadcrumb: true,
        showSandwichInBreadcrumb: true,
        showPushpin: true
    },
    children: [{
        path: ':nodeId',
        data: { title: 'Запись', showInBreadcrumb: false },
        children: [{
            path: '',
            component: DictionaryComponent,
            pathMatch: 'full',
            data: { showBreadcrumb: true, showSandwichInBreadcrumb: true, showPushpin: true },
        }, {
            path: 'edit',
            data: {
                title: 'Редактирование',
                showInBreadcrumb: false,
                showSandwichInBreadcrumb: false,
                showBreadcrumb: true,
                closeStyle: true,
                showPushpin: false
            },
            children: [
                {
                    path: '',
                    redirectTo: '0',
                    pathMatch: 'full',
                },
                {
                    path: ':tabNum',
                    component: CardComponent,
                    canDeactivate: [CanDeactivateGuard],
                }],
        }, {
            path: 'view',
            data: {
                title: 'Просмотр',
                showInBreadcrumb: false,
                showSandwichInBreadcrumb: false,
                showBreadcrumb: true,
                closeStyle: true,
                showPushpin: false
            },
            children: [
                {
                    path: '',
                    redirectTo: '0',
                    pathMatch: 'full',
                },
                {
                    path: ':tabNum',
                    component: CardComponent,
                }],
        }],
    }, {
        path: '',
        redirectTo: '0.',
        // component: DictionaryComponent,
        pathMatch: 'full',
    }],
}];

const routes: Routes = [{
    path: 'spravochniki/SEV',
    data: { title: 'СЭВ', showInBreadcrumb: true },
    canActivate: [AuthorizedGuard],
    children: childrenDictionariesComponent,
}, {
    path: 'spravochniki/nadzor',
    data: { title: 'Надзор', showInBreadcrumb: true },
    canActivate: [AuthorizedGuard],
    children: childrenDictionariesComponent,
}, {
    path: 'spravochniki',
    data: { title: 'Справочники', showInBreadcrumb: true },
    canActivate: [AuthorizedGuard],
    children: childrenDictionariesComponent,
}, {
    path: 'form',
    data: {
        title: 'Справочники',
        showInBreadcrumb: true,
        showBreadcrumb: true,
        showPushpin: true,
    },
    canActivate: [AuthorizedGuard],
    canDeactivate: [CanDeactivateGuard],
    children: formDictionariesComponent,
}, {
    path: 'desk',
    data: { title: 'Главная', showInBreadcrumb: false },
    canActivate: [AuthorizedGuard],
    children: [{
        path: '',
        pathMatch: 'full',
        component: DesktopComponent,
    }, {
        path: ':desktopId',
        component: DesktopComponent,
        data: { title: 'Главная', showInBreadcrumb: false, showBreadcrumb: false }
    }]
}, {
    path: 'login',
    canActivate: [UnauthorizedGuard],
    component: LoginComponent,
    data: { title: 'Вход в систему', showInBreadcrumb: false }
}, {
    path: 'test',
    component: TestPageComponent,
    data: { title: 'Test page for UI components' },
}, {
    path: 'delivery',
    canActivate: [AuthorizedGuard],
    component: DeliveryComponent,
    data: { title: 'delivery page' },
}, {
    path: 'rubric',
    canActivate: [AuthorizedGuard],
    component: RubricComponent,
    data: { title: 'rubric page' }
}, {
    path: 'templates',
    canActivate: [AuthorizedGuard],
    component: EosTemplateComponent,
    data: { title: 'template page' }
}, {
    path: 'department',
    canActivate: [AuthorizedGuard],
    component: DepartmentComponent,
    data: { title: 'department page' }
}, {
    path: 'user',
    canActivate: [AuthorizedGuard],
    component: UserRestComponent,
    data: { title: 'user page' }
}, {
    path: 'parameters',
    canActivate: [AuthorizedGuard, PermissionsGuard],
    data: {
        title: 'Параметры системы',
        showInBreadcrumb: false,
    },
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
}, {
    path: 'user-params-set',
    canActivate: [AuthorizedGuard, PermissionsGuard],
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: 'base-param',
        },
        {
            path: ':field-id',
            component: UserParamsComponent,
            canDeactivate: [CanDeactivateGuard],
            data: {
                showNav: true
            },
        },
    ]
}, {
    path: 'user_param',
    canActivate: [AuthorizedGuard],
    data: {
        title: 'Пользователи',
        showInBreadcrumb: true
    },
    children: [
        {
            path: 'sum-protocol',
            component: EosReportSummaryProtocolComponent,
            data: {
                title: 'Сводный протокол',
                showBreadcrumb: true,
                showInBreadcrumb: true,
            }
        },
        {
            path: 'users-stats',
            component: EosReportUsersStatsComponent,
            data: {
                title: 'Статистика по пользователям',
                showBreadcrumb: true,
                showInBreadcrumb: true,
            }
        },
        {
            path: 'default-settings',
            canActivate: [AuthorizedGuard],
            data: {
                title: 'Настройки по умолчанию',
                showInBreadcrumb: true,
            },
            children: [
                {
                    path: ':id',
                    pathMatch: 'full',
                    component: DefaultSettingsComponent,
                    canDeactivate: [CanDeactivateGuard],
                    data: {
                        showNav: true
                    },
                },
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'registration',
                },
            ]
        },
        {
            path: 'current-settings',
            canActivate: [AuthorizedGuard],
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: 'registration',
                },
                {
                    path: ':field-id',
                    component: CurrentUserSetComponent,
                    canDeactivate: [CanDeactivateGuard],
                    // data: {
                    //     showNav: true
                    // },
                },
            ]
        },
        {
            path: ':nodeId',
            component: UserSelectComponent,
            data: {
                showBreadcrumb: true,
                showInBreadcrumb: true,
                showSandwichInBreadcrumb: true,
                showPushpin: false
            },
        },
        {
            path: '',
            component: UserSelectComponent,
            data: {
                showBreadcrumb: true,
                showInBreadcrumb: true,
                showSandwichInBreadcrumb: true,
                showPushpin: true
            }
        }
    ]
},
{
    path: '',
    redirectTo: '/desk/system',
    pathMatch: 'full',
}, {
    path: '**',
    redirectTo: '/desk/system',
    pathMatch: 'full',
}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})

export class AppRoutingModule {
}
