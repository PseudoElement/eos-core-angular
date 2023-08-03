export enum UserType {
    /** Без права входа в систему */
    noLoginRights = -1,
    /** Имя и пароль в БД */
    usernamePasswordInBD = 0,
    /** ОС - аутентификация */
    OSAuthentication = 1,
    /**Пользователь в БД */
    userBD = 2,
    /** Имя и пароль */
    namePassword = 3,
    /** ОС - аутентификация на сервере */
    OSAuthenticationServer = 4
}
