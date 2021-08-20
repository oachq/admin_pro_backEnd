const getMenuFrontEnd = (role = 'USER_ROLE') => {

    const menu = [{
            titulo: 'Dashboard',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Main', url: '/' },
                { titulo: 'progressBar', url: 'progress' },
                { titulo: 'Gráfica', url: 'grafica1' },
                { titulo: 'Promesas', url: 'promesas' },
                { titulo: 'rxjs', url: 'rxjs' },

            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                //{titulo: 'Usuarios', url: 'usuario'},
                { titulo: 'Hospitales', url: 'hospital' },
                { titulo: 'Medicos', url: 'medico' },
            ]
        }
    ]

    if (role === 'ADMIN_ROLE') {

        menu[1].submenu.unshift({ titulo: 'Usuarios', url: 'usuario' })
    }

    return menu;

}

module.exports = {
    getMenuFrontEnd
}