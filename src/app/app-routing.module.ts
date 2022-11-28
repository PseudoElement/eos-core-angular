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
import { UsersPermissionGuard } from './guards/users-permission.guard';
import { SystemParamsGuard } from './guards/system-params.guard';

import { ParametersSystemComponent } from '../eos-parameters/parametersSystem/parametersSystem.component';
import { UserParamsComponent } from 'eos-user-params/eos-user-params.component';
import { UserSelectComponent } from 'eos-user-select/eos-user-select.component';
import { EosTemplateComponent } from 'eos-rest/clman/eos-template/eos-template.component';

import { DictFormComponent } from 'eos-dictionaries/dict-forms/dict-form.component';
import { EosReportUsersStatsComponent } from 'eos-user-params/report/users-stats/users-stats.component';
import { EosReportSummaryProtocolComponent } from 'eos-user-params/report/sum-protocol/sum-protocol.component';
import { DefaultSettingsComponent } from 'eos-user-params/default-options/default-settings.component';
import { CurrentUserSetComponent } from 'eos-user-params/current-user-set/current-user-set.component';
import { CanDeactivateDictGuard } from './guards/can-deactivate-dict.guard';
import { PluginReactComponent } from 'eos-rest/plugin-react/plugin-react.component';
import { EosBackgraundTasksComponent } from 'eos-backgraund-tasks/components/eos-backgraund-tasks/eos-backgraund-tasks.component';
import { EosBackgraundSingleComponent } from 'eos-backgraund-tasks/components/eos-backgraund-single/eos-backgraund-single.component';
import { EosInstrumentsListsComponent } from 'eos-instruments/components/eos-instruments-lists/eos-instruments-lists.component';
import { EosInstrumentsSingleComponent } from 'eos-instruments/components/eos-instruments-single/eos-instruments-single.component';
import { BackgroundTaskGuard } from './guards/background-tasks.guard';
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
const childrenDictionariesComponent: Routes = [{
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
    canDeactivate: [CanDeactivateDictGuard],
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
    canActivate: [AuthorizedGuard, SystemParamsGuard],
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
    canActivate: [AuthorizedGuard, UsersPermissionGuard],
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
    canActivate: [AuthorizedGuard, UsersPermissionGuard],
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
            path: 'user-session',
            canActivate: [AuthorizedGuard],
            component: PluginReactComponent,
            data: {
                title: 'Текущие сессии пользователей',
                showBreadcrumb: true,
                showInBreadcrumb: true,
                showSandwichInBreadcrumb: false,
                showPushpin: false
            }
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
    path: 'instruments',
    data: { title: 'Инструменты', showInBreadcrumb: false },
    canActivate: [AuthorizedGuard],
    children: [
        {
            path: '',
            component: EosInstrumentsListsComponent,
            pathMatch: 'full',
            canActivate: [AuthorizedGuard],
        },
        {
            path: ':taskId',
            component: EosInstrumentsSingleComponent,
            data: {
                showBreadcrumb: false,
                showInBreadcrumb: false,
                showSandwichInBreadcrumb: false,
                showPushpin: false
            },
        },
    ],
},
{
    path: 'background-tasks',
    data: { title: 'Сервисы', showInBreadcrumb: true },
    canActivate: [AuthorizedGuard, BackgroundTaskGuard],
    children: [
        {
            path: '',
            component: EosBackgraundTasksComponent,
            pathMatch: 'full',
            canActivate: [AuthorizedGuard],
        },
        {
            path: ':taskId',
            component: EosBackgraundSingleComponent,
            data: {
                showBreadcrumb: false,
                showInBreadcrumb: false,
                showSandwichInBreadcrumb: false,
                showPushpin: false
            },
            children: [
                {
                    path: '**',
                    component: EosBackgraundSingleComponent,
                    data: {
                        showBreadcrumb: false,
                        showInBreadcrumb: false,
                        showSandwichInBreadcrumb: false,
                        showPushpin: false
                    },

                }
            ]
        }, {
            path: '**',
            component: EosBackgraundTasksComponent,
            data: {
                showBreadcrumb: false,
                showInBreadcrumb: false,
                showSandwichInBreadcrumb: false,
                showPushpin: false
            },

        }]
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
